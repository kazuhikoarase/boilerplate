import pathlib
import json
import asyncio
import fastapi
import fastapi.staticfiles as staticfiles
import uvicorn
import websockets.server as websocket_server

# pip3 install websockets
# pip3 install FastAPI
# pip3 install uvicorn

script_path = pathlib.Path(__file__).resolve()
script_dir = script_path.parent


server_host = "0.0.0.0"
http_port = 8000
websocket_port = 8765

async def start_http_server():
    print(f"starting http_server at port {http_port} ...")

    app = fastapi.FastAPI()

    #@app.get("/")
    #async def read_root():
    #    return {"message": "Hello from FastAPI (HTTP Server)"}
    app.mount("/", staticfiles.StaticFiles(directory=script_dir / "public"), name="public")

    config = uvicorn.Config(app, host=server_host, port=http_port, log_level="warning") # log_level="info"
    http_server = uvicorn.Server(config)
    try:
        # serve instead run.
        await http_server.serve()
        raise asyncio.CancelledError
    finally:
        print("http_server stopped.")

async def websocket_server_handler(websocket, path):

    async def send(data):
        await websocket.send(json.dumps(data) )

    async def puke(data) :
        print("pukepukepuke")
        await send(data)

    actions = {
      "puke" : puke
    }

    async for message in websocket:
        print(f"Received: {message}")
        parsed = json.loads(message)
        print(f"  action:{parsed['action']}")
        action = actions[parsed['action']]
        await action(parsed)
        #json.dumps(
        #await websocket.send(message) # echo back to client.

async def start_websocket_server():
    print(f"starting websocket_server at port {websocket_port} ...")
    async with websocket_server.serve(websocket_server_handler, server_host, websocket_port) as server:
        try:
            await server.wait_closed()
        except asyncio.CancelledError:
            pass
        finally:
            print("websocket_server stopped.")

async def main():
    http_task = asyncio.create_task(start_http_server())
    websocket_task = asyncio.create_task(start_websocket_server())

    async def cancelAll():
        http_task.cancel()
        websocket_task.cancel()
        await asyncio.gather(http_task, websocket_task, return_exceptions=True)

    try:
        await asyncio.gather(http_task, websocket_task)
    except asyncio.CancelledError:
        await cancelAll()

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("KeyboardInterrupt, exit program.")

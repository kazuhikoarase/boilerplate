namespace mypkg {

  interface Task {
    name : string;
    children? : Task[];
    id? : number;
    pid? : number;
  }

  var treeTasks : Task[] = [
    { name: 'Task#1', children: [
        { name: 'Task#2' },
        { name: 'Task#4' },
        { name: 'Task#7' }
      ]
    },
    { name: 'Task#3', children: [
        { name: 'Task#6' },
        { name: 'Task#9', children: [
            { name: 'Task#8' },
          ]
        },
      ]
    },
    { name: 'Task#5' },
    { name: 'Task#10' }
  ];

  var root = new TreeNode<Task>({ name : 'root' });

  export var app = function() {
    
    var buttons = util.createElement('div', [ util.createElement('button', 
      { props: { textContent: 'New Task' },
        on: { click: function() {
          root.addChild(new TreeNode<Task>({ name : 'NewTask' }) );
          updateView();
        } } })]);

    var content = util.createElement('div', { style : { width: '200px' } });

    var updateView = function() {
      content.innerHTML = '';

      var a = function(
          task : TreeNode<Task>, node : HTMLElement, nest : number) {
        if (nest > 0) {
          node.appendChild(document.createTextNode(
            task.getUserObject().name) );
        }
        var numChildren = task.numChildren();
        for (var i = 0; i < numChildren; i += 1) {
          var childNode = util.createElement('div',
            { style: {
                borderTop: '1px solid black',
                borderLeft: '1px solid black',
                marginLeft: nest > 0? '8px' : '' } });
          node.appendChild(childNode);
          a(task.getChildAt(i), childNode, nest + 1);
        }
      };
      a(root, content, 0);
    };

    for (var i = 0; i < 10; i += 1) {
      root.addChild(new TreeNode<Task>({ name : 'Task#' + (i + 1) } ) );
    }
    root.getChildAt(0).addChild(root.getChildAt(1) );
    root.getChildAt(0).addChild(root.getChildAt(2) );
    root.getChildAt(0).addChild(root.getChildAt(4) );
    root.getChildAt(1).addChild(root.getChildAt(3) );
    root.getChildAt(1).addChild(root.getChildAt(4) );
    root.getChildAt(1).getChildAt(1).addChild(root.getChildAt(3) );
    updateView();

    var listTasks : Task[] = [];
    var l = function(tasks : Task[], pid : number) {
      tasks.forEach(function(task) {
        var id = listTasks.length + 1;
        listTasks.push({ name: task.name, pid: pid, id: id });
        if (task.children) {
          l(task.children, id);
        }
      });
    }
    l(treeTasks, 0);

    listTasks.forEach(function(task) {
      console.log(JSON.stringify(task) );
    });
/*
    var tasks : any[] = [
      { id: 1, pid: 0 },
      { id: 2, pid: 1 },
      { id: 3, pid: 0 },
      { id: 6, pid: 3 },
      { id: 7, pid: 1 },
      { id: 8, pid: 9 },
      { id: 4, pid: 1 },
      { id: 5, pid: 0 },
      { id: 9, pid: 3 },
      { id: 10, pid: 0 }
    ];
    var grp : any = {};
    tasks.sort(function(t1, t2) {
      return t1.id < t2.id? -1 : 1;
    });
    tasks.forEach(function(task) {
      (grp[task.pid] || (grp[task.pid] = []) ).push(task.id);
    });
    console.log(JSON.stringify(grp, null, 2) );
*/
    return util.createElement('div', [buttons, content]);
  };
}

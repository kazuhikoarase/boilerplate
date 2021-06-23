package mypkg;

import javax.ejb.Remote;
import javax.ejb.Stateless;

@Stateless
@Remote(IMyService.class)
public class MyService implements IMyService {
	@Override
	public String getMessage(String msg) {
		return msg;
	}
}

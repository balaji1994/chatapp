<?php

class UsersController extends Controller
{
	
	public function actionUserValidate()
	 {
		$json = file_get_contents('php://input');
		$data = json_decode($json);
		$is_delete=0;
		 $model=Users::model()->find("email=:uname AND password=:pass AND is_delete=:del",array(":uname"=>$data->username,":pass"=>md5($data->password),":del"=>$is_delete));
		$tmp=array();
		if(!empty($model))
		{
			$model->is_active=1;
			$model->save(false);
			$tmp['status']=true;
			$tmp['data']=$model->name;
			$tmp['id']=$model->id;
			$tmp['profilepic']=$model->profilepic;
		}
		else
		{
			$tmp['status']=false;
		}
		echo json_encode($tmp);
	 }
	 public function actionSaveMessage()
	 {
	 	$json = file_get_contents('php://input');
		$data = json_decode($json);
		// $model=Users::model()->find("id=:id",array(':id'=>$data['s_id']));
		$message=new ChatMessage();
		// print_r($message);
		// exit;
		$message->sender_id=$data->s_id;
		$message->message=$data->message;
		$message->receiver_id=$data->r_id;
		if($message->save(false))
		{
			$data=array('status'=>'200','message'=>'saved successfully');
		}
		else
		{
			$data=array('status'=>'fail','message'=>'not saved internal error');
		}
	 }
	 public function actionViewMessage()
	 {
	 	$json = file_get_contents('php://input');
		$data = json_decode($json);
		$zero=0;
		$one=1;
		$messages=ChatMessage::model()->findAll('((sender_id=:s_id AND receiver_id=:r_id) OR (sender_id=:r_id AND receiver_id=:s_id)) AND sender_delete=:zero AND (receiver_delete=:one OR receiver_delete=:zero)',array(':s_id'=>$data->s_id,':r_id'=>$data->r_id,':zero'=>$zero,':one'=>$one));
		if(!empty($messages))
		{
			$tmp=array();
			$result=array('status'=>'200','messages'=>array());
			foreach($messages as $message)
			{
				$tmp['s_id']=$message->sender_id;
				$tmp['sender_name']=$this->getname($message->sender_id);
				$tmp['receiver_name']=$this->getname($message->receiver_id);
				$tmp['r_id']=$message->receiver_id;
				$tmp['message']=$message->message;
				array_push($result['messages'],$tmp);
			}
			
			$data=$result;
			echo json_encode($data);
		}
		else
		{
			$data=array('status'=>'fail','message'=>'No messages found');
			echo  json_encode($data);
		}
		
	 }
	 public function actionMakeRead()
	 {
	 	$json = file_get_contents('php://input');
		$data = json_decode($json);
		$zero=0;
		$messages=ChatMessage::model()->findAll('(sender_id=:other AND receiver_id=:id) AND is_read=:zero',array(':other'=>$data->other,':id'=>$data->id,':zero'=>$zero));

		if(!empty($messages))
		{
			$tmp=array();
			foreach($messages as $message)
			{
				$message->is_read=1;
				$message->save(false);
			}
			$result=array('status'=>'200','Message'=>"success");
			$data=$result;
			echo json_encode($data);
		}
		else
		{
			$data=array('status'=>'fail','message'=>'No messages found');
			echo  json_encode($data);
		}

	}
	 public function getname($id)
	 {
	 	$model=Users::model()->find('id=:id',array(':id'=>$id));
	 	if(!empty($model))
	 	{
	 		return $model->name;
	 	}
	 	else
	 	{
	 		return 0;
	 	}
	 }
	 public function actionResponseMessage()
	 {
	 	$json = file_get_contents('php://input');
		$data = json_decode($json);
		$question=$data->question;
		$model=RoboReply::model()->find("questions LIKE '%".$question."%'");
		if(!empty($model))
		{
			
				$response=$model->response;
				$data=array('status'=>'200','message'=>$response);
				echo json_encode($data);
		}
		else
		{
			$data=array('status'=>'fail','message'=>'No Response found');
			echo json_encode($data);
		}
	 }
	public function actionClearallMessage()
	{
		$json = file_get_contents('php://input');
		$data = json_decode($json);
		$messages=ChatMessage::model()->findAll('(sender_id=:s_id AND receiver_id=:r_id) OR (sender_id=:r_id AND receiver_id=:s_id) AND sender_delete=:zero',array(':s_id'=>$data->s_id,':r_id'=>$data->r_id,':zero'=>0));
		if(!empty($messages))
		{
			foreach($messages as $message)
			{
				if($message->sender_id==$data->s_id)
				{
					$message->sender_delete=1;
					$message->save(false);
				}
				else
				{
					$message->receiver_delete=1;
					$message->save(false);
				}
			}
			$data=array('status'=>'200','message'=>'Messages cleared');
			echo json_encode($data);
		}
		else
		{
			$data=array('status'=>'fail','message'=>'No Messages found');
			echo json_encode($data);
		}
	}
	public function actionUnreadCount()
	{
		$json = file_get_contents('php://input');
		$data = json_decode($json);
		$isRead=0;
		$model=Users::model()->findAll('is_delete=:isdel AND id<>:usr_id',array(':isdel'=>0,':usr_id'=>$data->s_id));
		if(!empty($model))
		{
			$tmp=array();
			$result=array('status'=>'200','users'=>array());
			foreach($model as $user)
			{
				$unreadmessages=ChatMessage::model()->findAll('(sender_id=:other AND receiver_id=:usr_id) AND is_read=:zero',array(':usr_id'=>$data->s_id,':zero'=>$isRead,':other'=>$user->id));
				$tmp['id']=$user->id;
				$tmp['unread_messages']=count($unreadmessages);
				array_push($result['users'],$tmp);
			}
			$data=$result;
			echo json_encode($data);
		}
		else
		{
			$data=array('status'=>'fail','unread_count'=>0);
			echo json_encode($data);
		}

	}
	public function actionListUsers()
	{
		$json = file_get_contents('php://input');
		$data = json_decode($json);
		$model=Users::model()->findAll('is_delete=:isdel AND id<>:usr_id',array(':isdel'=>0,':usr_id'=>$data->s_id));
		$isRead=0;
		if(!empty($model))
		{
			$tmp=array();
			$result=array('status'=>'200','users'=>array());
			foreach($model as $user)
			{
				$unreadmessages=ChatMessage::model()->findAll('(sender_id=:other AND receiver_id=:usr_id) AND is_read=:zero',array(':usr_id'=>$data->s_id,':zero'=>$isRead,':other'=>$user->id));
				$tmp['id']=$user->id;
				$tmp['name']=$user->name;
				$tmp['is_active']=$user->is_active;
				$tmp['profilepic']=$user->profilepic;
				$tmp['status']=$user->status;
				$tmp['unread_messages']=count($unreadmessages);
				array_push($result['users'],$tmp);
			}
			$data=$result;
			echo json_encode($data);
		}
		else
		{
			$data=array('status'=>'fail','message'=>'No Users found');
			echo json_encode($data);
		}
	}
	public function actionupdateProfile()
	{
		$json = file_get_contents('php://input');
		$data = json_decode($json);
		$model=Users::model()->findAll('is_delete=:isdel AND id=:usr_id',array(':isdel'=>0,':usr_id'=>$data->s_id));

	}
	public function actionvalidateEmail()
	{
		$json = file_get_contents('php://input');
		$data = json_decode($json);
		$model=Users::model()->find('email=:email',array(':email'=>$data->email));
		if(!empty($model))
		{
			$data=array('status'=>'fail','message'=>'fail');
			echo json_encode($data);
		}
		else
		{
			$data=array('status'=>'200','message'=>'success');
			echo json_encode($data);
		}
	}
	public function actionsaveProfile()
	{
		$json = file_get_contents('php://input');
		$data = json_decode($json);
		print_r($data->profilepic[0]);
		exit;
		$model=new Users;
		$model->name=$data->name;
		$model->last_name=$data->lname;
		$model->password=md5($data->password);
		$model->email=$data->email;
		if($model->save(false))
			{
				$data=array('status'=>'200','message'=>'success');
				echo json_encode($data);
			}
			else
			{
				$data=array('status'=>'fail','message'=>'fail');
				echo json_encode($data);
			}
	}
	public function actionstatusChange()
	{
		$json = file_get_contents('php://input');
		$data = json_decode($json);
		$model=Users::model()->find('id=:sid',array(':sid'=>$data->s_id));
		if($data->state=="online")
		{
			$model->status=1;
			$model->save(false);
			$data=array('status'=>"200",'state'=>1);
		}
		else if($data->state=="offline")
		{
			$model->status=0;
			$model->save(false);
			$data=array('status'=>"200",'state'=>0);
		}
		echo json_encode($data);
	}
	public function actiongetStatus(){
		$json = file_get_contents('php://input');
		$data = json_decode($json);
		$model=Users::model()->find('id=:sid',array(':sid'=>$data->s_id));
		if(!empty($model))
		{
			$status=$model->status;
			if($status==1)
			{
				$data=array('status'=>"200",'state'=>1);
			}
			else
			{
				$data=array('status'=>"200",'state'=>0);
			}
			echo json_encode($data);
		}
	}
	public function actiongetuserprofile(){
		$json = file_get_contents('php://input');
		$data = json_decode($json);
		$model=Users::model()->find('id=:id',array(':id'=>$data->id));
		if(!empty($model))
		{
		  $result=array('status'=>'200','user'=>array());
		  $tmp=array();
		  $tmp['id']=$model->id;
		  $tmp['name']=$model->name;
		  $tmp['email']=$model->email;
		  $tmp['profilepic']=$model->profilepic;
		  array_push($result['user'],$tmp);
		  $data=$result;
		  echo json_encode($data);
		}
		else
		{
			$result=array('status'=>'fail','message'=>'user not found');
		}
	}

}

<?php
include('./mysql.php');
$fn = $_GET['fn'];
$fn();
/*****获取cart中指定用户的商品id****/
function getGoodsId()
 {
   $userId = $_GET['userId'];
   $sql = 'select productId,num from computercart where userId='.$userId;
   $data = select($sql);
   echo json_encode([
    'stateCode'=>200,
    'state'=>'success',
    'data'=>$data
  ]);
 }

function lst()
{
  $id = $_POST['goodsId'];
  $id = substr($id,0,strlen($id)-1);
  // 一次性获取多条数据
  $sql = "select * from computer where id in ($id)";
 // echo $sql;
 $data = select($sql);
 echo json_encode([
  'stateCode'=>200,
  'state'=>'success',
  'data'=>$data
]);
}

function update()
{
  $gId = $_GET['gId'];
  $num = $_GET['gNum'];
  $user = $_GET['userId'];
  $sql = "update computercart set num=$num where productId=$gId and userId= $user";
  $res = query($sql);
  if($res==1){
    echo json_encode([
      'stateCode'=>200,
      'state'=>'success',
      'data'=>''
    ]);
  }else{
    echo json_encode([
      'stateCode'=>201,
      'state'=>'error',
      'data'=>''
    ]);
  }

}

function delete()
{
  $gId = $_GET['gId'];
  $user = $_GET['userId'];
  $sql = "delete from computercart where productId=$gId and userId= $user";
  $res = query($sql);
  if($res==1){
    echo json_encode([
      'stateCode'=>200,
      'state'=>'success',
      'data'=>''
    ]);
  }else{
    echo json_encode([
      'stateCode'=>201,
      'state'=>'error',
      'data'=>''
    ]);
  }
}

function deleteAll(){
  $sql="delete from computercart";
  $res=query($sql);
  if($res==1){
    echo json_encode([
      'stateCode'=>200,
      'state'=>'success',
      'data'=>''
    ]);
  }else{
    echo json_encode([
      'stateCode'=>201,
      'state'=>'error',
      'data'=>''
    ]);
  }
}
?>
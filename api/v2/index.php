<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: PUT, GET, POST, DELETE, OPTIONS');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Access-Control-Allow-Origin");
header("Cache-Control: no-cache");
//header("Content-Type:text/html;charset=utf-8");
//header('content-type: application/json; charset=utf-8');
date_default_timezone_set("Asia/Shanghai");

//include the config file to get the settings
include("./config.php");
include("./events_api.php");
require 'flight/Flight.php';

//map the method
Flight::map('get_request_object', function(){
	$body = Flight::request()->getBody();
	$obj = json_decode($body, TRUE);
	return $obj;
});

//list events
Flight::route('GET /events', function(){
	Flight::lastModified(time());
	$api = new EventsApi();
	echo $api->getEventList(NULL);
});
Flight::route('GET /events/years/@year', function($year){
	Flight::lastModified(time());
	$api = new EventsApi();
	echo $api->getEventList($year);
});

//hierarchy
Flight::route('GET /events/hierarchy', function(){
	$api = new EventsApi();
	echo $api->getHierarchy();
});

//list tags
Flight::route('GET /events/tags', function(){
	$api = new EventsApi();
	echo $api->getTagList();
});

//get the event by id
Flight::route('GET /events/@id', function($id){
    $api = new EventsApi();
	echo $api->getEvent($id);
});

//create an event
Flight::route('OPTIONS /events', function(){
	
});
Flight::route('POST /events', function(){
	$api = new EventsAPI();
	echo $api->addEvent(Flight::get_request_object());
});

//update the event
Flight::route('OPTIONS /events/@id', function($id){
	
});
Flight::route('PUT /events/@id', function($id){
	$api = new EventsAPI();
	echo $api->editEvent($id, Flight::get_request_object());
});

//delete an event
Flight::route('DELETE /events/@id', function($id){
    $api = new EventsAPI();
	echo $api->deleteEvent($id);
});

Flight::start();
?>

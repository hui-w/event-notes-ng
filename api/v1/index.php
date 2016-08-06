<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: PUT, GET, POST, DELETE, OPTIONS');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Access-Control-Allow-Origin");
//header("Content-Type:text/html;charset=utf-8");
header('content-type: application/json; charset=utf-8');
date_default_timezone_set("Asia/Shanghai");

//include the config file to get the settings
include("./config.php");

function guid(){
    if (function_exists('com_create_guid')){
        return com_create_guid();
    }else{
        mt_srand((double)microtime()*10000);//optional for php 4.2.0 and up.
        $charid = strtoupper(md5(uniqid(rand(), true)));
        $hyphen = ""; //chr(45);// "-"
        $uuid = //chr(123)// "{"
                substr($charid, 0, 8).$hyphen
                .substr($charid, 8, 4).$hyphen
                .substr($charid,12, 4).$hyphen
                .substr($charid,16, 4).$hyphen
                .substr($charid,20,12);
                //chr(125);// "}"
        return $uuid;
    }
}

function getRequest($key){
	if ((isset($_REQUEST[$key])) && (!empty($_REQUEST[$key]))) {
    	return $_REQUEST[$key];
    } else {
    	return NULL;
    }
}

// Helper method to get a string description for an HTTP status code
// From http://www.gen-x-design.com/archives/create-a-rest-api-with-php/ 
function getStatusCodeMessage($status)
{
    // these could be stored in a .ini file and loaded
    // via parse_ini_file()... however, this will suffice
    // for an example
    $codes = Array(
        100 => 'Continue',
        101 => 'Switching Protocols',
        200 => 'OK',
        201 => 'Created',
        202 => 'Accepted',
        203 => 'Non-Authoritative Information',
        204 => 'No Content',
        205 => 'Reset Content',
        206 => 'Partial Content',
        300 => 'Multiple Choices',
        301 => 'Moved Permanently',
        302 => 'Found',
        303 => 'See Other',
        304 => 'Not Modified',
        305 => 'Use Proxy',
        306 => '(Unused)',
        307 => 'Temporary Redirect',
        400 => 'Bad Request',
        401 => 'Unauthorized',
        402 => 'Payment Required',
        403 => 'Forbidden',
        404 => 'Not Found',
        405 => 'Method Not Allowed',
        406 => 'Not Acceptable',
        407 => 'Proxy Authentication Required',
        408 => 'Request Timeout',
        409 => 'Conflict',
        410 => 'Gone',
        411 => 'Length Required',
        412 => 'Precondition Failed',
        413 => 'Request Entity Too Large',
        414 => 'Request-URI Too Long',
        415 => 'Unsupported Media Type',
        416 => 'Requested Range Not Satisfiable',
        417 => 'Expectation Failed',
        500 => 'Internal Server Error',
        501 => 'Not Implemented',
        502 => 'Bad Gateway',
        503 => 'Service Unavailable',
        504 => 'Gateway Timeout',
        505 => 'HTTP Version Not Supported'
    );

    return (isset($codes[$status])) ? $codes[$status] : '';
}

// Helper method to send a HTTP response code/message
function sendResponse($status = 200, $body = '', $content_type = 'text/html')
{
    $status_header = 'HTTP/1.1 ' . $status . ' ' . getStatusCodeMessage($status);
    header($status_header);
    header('Content-type: ' . $content_type);
    echo $body;
}

class EventsAPI {

    private $db;

    // Constructor - open DB connection
    function __construct() {
        $this->db = new mysqli(_DB_SERVER_, _DB_USER_, _DB_PASSWORD_, _DB_NAME_);
        $this->db->autocommit(FALSE);
        $this->db->query("SET NAMES utf8");
    }

    // Destructor - close DB connection
    function __destruct() {
        $this->db->close();
    }
	
	function addEvent($event_obj) {
		$id = guid();
		$year = $event_obj["year"];
		$month = $event_obj["month"];
		$date = $event_obj["date"];
		$text = $event_obj["text"];
		$number = $event_obj["number"];
		$flag = $event_obj["flag"];
		$recurrence = $event_obj["recurrence"];
		$tag = $event_obj["tag"];

		$stmt = $this->db->prepare("INSERT INTO events(id, year, month, date, text, number, flag, recurrence, tag, timestamp) values(?,?,?,?,?,?,?,?,?,?)");
		$stmt->bind_param("sdddsdddsd", $id, $year, $month, $date, $text, $number, $flag, $recurrence, $tag, time());
		$stmt->execute();
		$stmt->close();
		
		// Return the new ID, encoded with JSON
		$result = array(
			"id" => $id,
		);
		sendResponse(200, json_encode($result));
		return true;
	}
	
	function editEvent($event_obj) {
		$id = $event_obj["id"];
	    $year = $event_obj["year"];
		$month = $event_obj["month"];
		$date = $event_obj["date"];
		$text = $event_obj["text"];
		$number = $event_obj["number"];
		$flag = $event_obj["flag"];
		$recurrence = $event_obj["recurrence"];
		$tag = $event_obj["tag"];

		$stmt = $this->db->prepare("UPDATE events SET year=?, month=?, date=?, text=?, number=?, flag=?, recurrence=?, tag=?, timestamp=? WHERE id=?");
		$stmt->bind_param("dddsdddsds", $year, $month, $date, $text, $number, $flag, $recurrence, $tag, time(), $id);
		$stmt->execute();
		$stmt->close();
		
		// Return the new ID, encoded with JSON
		$result = array(
			"id" => $id,
		);
		sendResponse(200, json_encode($result));
		return true;
	}
	
	function deleteEvent($id) {
		$this->db->query("DELETE from events where id=\"$id\"");
		$this->db->commit();
		
		$result = array(
			"id" => $id,
		);
		sendResponse(200, json_encode($result));
		return true;
	}
	
	function getEvent($id) {
		if ($stmt = $this->db->prepare("SELECT id, year, month, date, text, number, flag, recurrence, tag, timestamp FROM events WHERE id=?")) {
			$stmt->bind_param("s", $id);
			$stmt->execute();

			/* bind variables to prepared statement */
			$stmt->bind_result($id, $year, $month, $date, $text, $number, $flag, $recurrence, $tag, $timestamp);
			
			$result = null;
			if ($stmt->fetch()) {
				//process the line
				$result = array(
					"id" => $id,
					"year" => $year,
					"month" => $month,
					"date" => $date,
					"text" => $text,
					"number" => $number,
					"flag" => $flag,
					"recurrence" => $recurrence,
					"tag" => $tag,
					"timestamp" => $timestamp
				);
			}

			/* close statement */
			$stmt->close();
			
			sendResponse(200, json_encode($result));
            return true;
		}
		
		sendResponse(500, "Database Error");
        return false;
	}

	function getTagList() {
		$tags = array();
		$query = "SELECT DISTINCT tag FROM events ORDER BY tag ASC";
		
		/* prepare statement */
		if ($stmt = $this->db->prepare($query)) {
			$stmt->execute();

			/* bind variables to prepared statement */
			$stmt->bind_result($tag);
			
			//get the records
			while ($stmt->fetch()) {
				array_push($tags, $tag);
			}

			/* close statement */
			$stmt->close();
		}
		
		//respond with the result
		$result =  array(
			"response_time" => time(),
			"payload" => array(
				"tags" => $tags
			)
		);
		sendResponse(200, json_encode($result));
        return true;
	}
	
	function getEventList($year) {
		//==================================================Events
		$events = array();
		$record_count = 0;
		if($year != NULL) {
			$query = "SELECT id, year, month, date, text, number, flag, recurrence, tag, timestamp FROM events WHERE year = '".$year."' ORDER BY year DESC, month DESC, date DESC";
		} else {
			$query = "SELECT id, year, month, date, text, number, flag, recurrence, tag, timestamp FROM events ORDER BY year DESC, month DESC, date DESC";
		}
		
		/* prepare statement */
		//if ($stmt = $this->db->prepare("SELECT id, year, month, date, text, number, flag, recurrence, tag, timestamp FROM events where year=\"".$year."\"")) {
		if ($stmt = $this->db->prepare($query)) {
			$stmt->execute();

			/* bind variables to prepared statement */
			$stmt->bind_result($id, $year, $month, $date, $text, $number, $flag, $recurrence, $tag, $timestamp);
			
			//get the records
			while ($stmt->fetch()) {
				$record_count ++;
				
				//process the line
				$item = array(
					"id" => $id,
					"year" => $year,
					"month" => $month,
					"date" => $date,
					"text" => $text,
					"number" => $number,
					"flag" => $flag,
					"recurrence" => $recurrence,
					"tag" => $tag,
					"timestamp" => $timestamp
				);
				array_push($events, $item);
			}

			/* close statement */
			$stmt->close();
		}

		//==================================================years
		$years = array();
		$query = "SELECT DISTINCT year FROM events ORDER BY year ASC";
		
		/* prepare statement */
		if ($stmt = $this->db->prepare($query)) {
			$stmt->execute();

			/* bind variables to prepared statement */
			$stmt->bind_result($year);
			
			//get the records
			while ($stmt->fetch()) {
				array_push($years, $year);
			}

			/* close statement */
			$stmt->close();
		}
		
		//respond with the result
		$result =  array(
			"response_time" => time(),
			"record_count" => $record_count,
			"payload" => array(
				"years" => $years,
				"events" => $events
			)
		);
		sendResponse(200, json_encode($result));
        return true;
	}
	
	function getHierarchy() {
		/* prepare statement */
		//if ($stmt = $this->db->prepare("SELECT id, year, month, date, text, number, flag, recurrence, tag, timestamp FROM events where year=\"".$year."\"")) {
		if ($stmt = $this->db->prepare("SELECT id, year, month, date, text, number, flag, recurrence, tag, timestamp FROM events ORDER BY year, month, date")) {
			$month_array = array();
			$stmt->execute();

			/* bind variables to prepared statement */
			$stmt->bind_result($id, $year, $month, $date, $text, $number, $flag, $recurrence, $tag, $timestamp);
			
			//get the record hierarchy
			$record_count = 0;
			$current_year = null;
			$current_month = null;
			$current_date = null;
			
			while ($stmt->fetch()) {
				$record_count ++;
				
				//new month
				if ($current_year != $year || $current_month != $month) {
					$month_array[] = array(
						"year" => $year,
						"month" => $month,
						"dates" => array()
					);
				}
				
				//new date
				if ($current_year != $year || $current_month != $month ||  $current_date != $date) {
					$date_array =& $month_array[count($month_array) - 1]["dates"];
					$item = array(
						"date" => $date,
						"events" => array()
					);
					array_push($date_array, $item);
				}
				
				//process the line
				$item = array(
					"id" => $id,
					"text" => $text,
					"number" => $number,
					"flag" => $flag,
					"recurrence" => $recurrence,
					"tag" => $tag,
					"timestamp" => $timestamp
				);
				
				//add the record to the current date
				$date_array =& $month_array[count($month_array) - 1]["dates"];
				$event_array =& $date_array[count($date_array) - 1]["events"];
				array_push($event_array, $item);
				
				//save current date
				$current_year = $year;
				$current_month = $month;
				$current_date = $date;
			}

			/* close statement */
			$stmt->close();
			
			$result =  array(
				"response_time" => time(),
				"record_count" => $record_count,
				"payload" => $month_array
			);
			sendResponse(200, json_encode($result));
            return true;
		}
		
		sendResponse(500, "Database Error");
        return false;
	}
}

// This is the first thing that gets called when this page is loaded
$action = getRequest("action");
if ($action != NULL)
{
	if($action == "list") {
		//list
		$year = getRequest("year");
		$api = new EventsAPI();
		$api->getEventList($year);
	} else if ($action == "tags") {
		//get tags
		$api = new EventsAPI();
		$api->getTagList();
	} else if ($action == "hierarchy") {
		//get hierarchy
		$api = new EventsAPI();
		$api->getHierarchy();
	} else if ($action == "get") {
		//get hierarchy
		$id = getRequest("id");
		if ($id != NULL) {
			$api = new EventsAPI();
			$api->getEvent($id);
		} else {
			sendResponse(400, 'Invalid request to create a record');
			return false;
		}
	}else if ($action == "add") {
		//add
		try {
			$res = file_get_contents('php://input', 'r');
			$event_obj = json_decode($res, TRUE);
			$api = new EventsAPI();
			$api->addEvent($event_obj);
		}
		catch(Exception $e) {
			sendResponse(400, $e->getMessage());
			//sendResponse(400, 'Invalid request to create a record');
			return false;
		}
	} else if ($action == "edit") {
		//edit
		try {
			$res = file_get_contents('php://input', 'r');
			$event_obj = json_decode($res, TRUE);
			$api = new EventsAPI();
			$api->editEvent($event_obj);
		}
		catch(Exception $e) {
			sendResponse(400, $e->getMessage());
			//sendResponse(400, 'Invalid request to create a record');
			return false;
		}
	} else if ($action == "delete") {
		//delete
		$id = getRequest("id");
		if ($id != NULL) {
			$api = new EventsAPI();
			$api->deleteEvent($id);
		} else {
			sendResponse(400, 'Invalid request to delete a record');
			return false;
		}
	} else {
		sendResponse(405, "The method is not supported");
	}
} else {
	sendResponse(405, "No method has been specified");
}
?>
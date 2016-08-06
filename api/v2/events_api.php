<?php
class EventsApi {

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
	
	function guid() {
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
	
	function addEvent($event_obj) {
		$id = $this->guid();
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
		
		// Return the new ID
		return $id;
	}
	
	function editEvent($id, $event_obj) {
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
		
		return true;
	}
	
	function deleteEvent($id) {
		$this->db->query("DELETE from events where id=\"$id\"");
		$this->db->commit();
		
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
			
            return json_encode($result);
		}
		
        return NULL;
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

        return json_encode($result);
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
		$months = array();
		//$query = "SELECT DISTINCT year FROM events ORDER BY year ASC";
		$query = "SELECT YEAR, MONTH , COUNT( ID ) FROM events GROUP BY YEAR, MONTH";
		
		/* prepare statement */
		if ($stmt = $this->db->prepare($query)) {
			$stmt->execute();

			/* bind variables to prepared statement */
			$stmt->bind_result($year, $month, $count);
			
			//get the records
			while ($stmt->fetch()) {
				//distinct year list
				if(count($years) == 0 || $year != $years[count($years) - 1]) {
					array_push($years, $year);
				}
				
				//distinct month list
				$item = array(
					"year" => $year,
					"month" => $month,
					"count" => $count
				);
				array_push($months, $item);
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
				"months" => $months,
				"events" => $events
			)
		);

        return json_encode($result);
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

            return json_encode($result);
		}
		
        return NULL;
	}
}
?>
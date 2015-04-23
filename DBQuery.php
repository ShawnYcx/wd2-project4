<?php
	class DBQuery {
		private $query;
		private $result;
		private $error;
		private $db;
		
		function DBQuery($q){
			$this->db = new mysqli("127.0.0.1","root","","Pong");
			if (mysqli_connect_errno()){
				$this->error = mysqli_connect_error();
				echo "Error: connection to database failed %s\n ".$this->error;
				exit();
			}
			$this->query = $q;
		}
		public function set_query($new_query){
			$this->query = $new_query;
		}
		
		public function execute_query(){
			$this->result = $this->db->query($this->query);
		}
		
		public function get_result(){
			return $this->result;
		}
		
		public function close(){
			$this->db->close();
		}
	}
?>
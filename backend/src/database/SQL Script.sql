-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: petrescue_db
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `activity_status`
--

USE petrescue_db;

DROP TABLE IF EXISTS `activity_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `activity_status` (
  `ats_id` bigint NOT NULL AUTO_INCREMENT,
  `activity_type_id` bigint DEFAULT NULL,
  `status_id` bigint DEFAULT NULL,
  `status_description` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_hand_over` varchar(1) COLLATE utf8mb4_unicode_ci DEFAULT 'N',
  `is_request` varchar(1) COLLATE utf8mb4_unicode_ci DEFAULT 'N',
  PRIMARY KEY (`ats_id`),
  KEY `fk_01_activity_status` (`activity_type_id`),
  KEY `fk_02_activity_status` (`status_id`),
  CONSTRAINT `fk_01_activity_status` FOREIGN KEY (`activity_type_id`) REFERENCES `activity_type` (`type_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_02_activity_status` FOREIGN KEY (`status_id`) REFERENCES `status` (`status_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=122 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity_status`
--

LOCK TABLES `activity_status` WRITE;
/*!40000 ALTER TABLE `activity_status` DISABLE KEYS */;
INSERT INTO `activity_status` VALUES (1,1,1,'Missing pet incident reported but not yet addressed by assisting organization','N','N'),(2,1,3,'Missing pet incident assigned and actively being worked on','N','N'),(7,5,11,'Found pet report temporarily paused, awaiting further action','N','N'),(8,5,2,'Found pet report awaiting hand-over request and verification of details','N','N'),(22,1,11,'Missing pet incident temporarily paused, awaiting further action','N','N'),(26,5,6,'Found pet report resolved, and pet reunited with owner','N','N'),(28,5,1,'Pet hand-over request created but not yet addressed by assisting organization','Y','Y'),(31,2,8,'Pet successfully retrieved into shelter care','N','N'),(41,1,6,'Missing pet report resolved, and pet reunited with owner','N','N'),(42,5,7,'Found report formally closed after reunion','N','N'),(61,5,5,'Found pet report is successfully verified','N','N'),(62,5,8,'Pet is found and handed-over to the assisting organization for reunion with owner','N','N'),(82,11,3,'Search on-going','N','N'),(83,11,11,'Search temporarily on hold','N','N'),(84,11,6,'Search complete','N','N'),(86,5,13,'Pet hand-over request approved','Y','Y'),(87,5,9,'Pet hand-over request rejected due to circumstances','Y','Y'),(101,5,6,'Pet hand-over confirmed, awaiting owner to fetch','Y','N'),(121,5,7,'Pet hand-over process complete, and pet reunited with owner','Y','N');
/*!40000 ALTER TABLE `activity_status` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `activity_type`
--

DROP TABLE IF EXISTS `activity_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `activity_type` (
  `type_id` bigint NOT NULL AUTO_INCREMENT,
  `type_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity_type`
--

LOCK TABLES `activity_type` WRITE;
/*!40000 ALTER TABLE `activity_type` DISABLE KEYS */;
INSERT INTO `activity_type` VALUES (1,'Missing Pet Incident'),(2,'Pet Retrieval'),(3,'Reunion'),(5,'Found Pet Report'),(10,'Pet'),(11,'Task'),(12,'Hand-over');
/*!40000 ALTER TABLE `activity_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `city`
--

DROP TABLE IF EXISTS `city`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `city` (
  `city_id` bigint NOT NULL AUTO_INCREMENT,
  `city_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`city_id`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `city`
--

LOCK TABLES `city` WRITE;
/*!40000 ALTER TABLE `city` DISABLE KEYS */;
INSERT INTO `city` VALUES (40,'Gqeberha'),(41,'East London');
/*!40000 ALTER TABLE `city` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `community_member`
--

DROP TABLE IF EXISTS `community_member`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `community_member` (
  `member_id` bigint NOT NULL AUTO_INCREMENT,
  `person_id` bigint DEFAULT NULL,
  PRIMARY KEY (`member_id`),
  KEY `fk_03_community_member` (`person_id`),
  CONSTRAINT `fk_03_community_member` FOREIGN KEY (`person_id`) REFERENCES `person` (`person_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `community_member`
--

LOCK TABLES `community_member` WRITE;
/*!40000 ALTER TABLE `community_member` DISABLE KEYS */;
INSERT INTO `community_member` VALUES (1,3),(2,4),(3,5),(4,8),(5,11),(6,12),(7,23),(8,25),(9,27);
/*!40000 ALTER TABLE `community_member` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contact_preference`
--

DROP TABLE IF EXISTS `contact_preference`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contact_preference` (
  `preference_id` bigint NOT NULL AUTO_INCREMENT,
  `contact_pref_name` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`preference_id`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact_preference`
--

LOCK TABLES `contact_preference` WRITE;
/*!40000 ALTER TABLE `contact_preference` DISABLE KEYS */;
INSERT INTO `contact_preference` VALUES (1,'Phone'),(2,'In App'),(3,'Any'),(21,'Email'),(41,'Phone or Email');
/*!40000 ALTER TABLE `contact_preference` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `found_pet_report`
--

DROP TABLE IF EXISTS `found_pet_report`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `found_pet_report` (
  `fpr_id` bigint NOT NULL AUTO_INCREMENT,
  `mpi_id` bigint DEFAULT NULL,
  `found_neighbourhood_id` bigint DEFAULT NULL,
  `found_street` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `report_description` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `report_status_id` bigint DEFAULT NULL,
  `date_found` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `verification_date` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT 'N/A',
  `reported_at` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `current_wellbeing_id` bigint DEFAULT NULL,
  `other_desc` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `finder_id` bigint DEFAULT NULL,
  `image_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`fpr_id`),
  KEY `fk_04_found_pet_report` (`found_neighbourhood_id`),
  KEY `fk_05_found_pet_report` (`current_wellbeing_id`),
  KEY `fk_06_found_pet_report` (`finder_id`),
  KEY `fk_07_found_pet_report` (`report_status_id`),
  KEY `fk_08_found_pet_report` (`mpi_id`),
  CONSTRAINT `fk_04_found_pet_report` FOREIGN KEY (`found_neighbourhood_id`) REFERENCES `neighbourhood` (`neighbourhood_id`),
  CONSTRAINT `fk_05_found_pet_report` FOREIGN KEY (`current_wellbeing_id`) REFERENCES `wellbeing_description` (`wellbeing_id`),
  CONSTRAINT `fk_06_found_pet_report` FOREIGN KEY (`finder_id`) REFERENCES `community_member` (`member_id`),
  CONSTRAINT `fk_07_found_pet_report` FOREIGN KEY (`report_status_id`) REFERENCES `activity_status` (`ats_id`),
  CONSTRAINT `fk_08_found_pet_report` FOREIGN KEY (`mpi_id`) REFERENCES `missing_pet_incident` (`mpi_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=401 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `found_pet_report`
--

LOCK TABLES `found_pet_report` WRITE;
/*!40000 ALTER TABLE `found_pet_report` DISABLE KEYS */;
INSERT INTO `found_pet_report` VALUES (361,501,59,'Colton Street','Found the pet on the road',121,'10/17/2026','N/A','10/18/2026',282,'N/A',2,'https://res.cloudinary.com/kj4ftyvs/image/upload/v1792341272/lcve98bpyykf4io2qyck.jpg'),(362,521,30,'Sulfer Street','Found at the door of the post office around 5am',121,'10/17/2026','N/A','10/18/2026',361,'Very scared and but friendly',3,'https://res.cloudinary.com/kj4ftyvs/image/upload/v1792362138/w2dkyug3tupl6r9ocmdo.jpg'),(364,522,53,'Fulham Street','Found at the gate of my home',121,'10/16/2026','N/A','10/18/2026',2,'N/A',1,'https://res.cloudinary.com/kj4ftyvs/image/upload/v1792354748/gfs5qv3stkxqibawoloc.jpg'),(365,544,33,'Highway N2 Road','Pet was found wandering along the roadside without supervision.',121,'10/19/2026','N/A','10/19/2026',2,'N/A',3,'https://res.cloudinary.com/kj4ftyvs/image/upload/v1792377174/x8h6xake9gpgy8n0irjd.jpg'),(381,585,27,'Cambridge Road','Found near the train station',8,'10/19/2026','N/A','10/20/2026',382,'Shy and persimistic',5,'https://res.cloudinary.com/kj4ftyvs/image/upload/v1792496665/ocwmxhudphft3lufqwzp.jpg'),(383,NULL,3,'45 Long Street','Found a sweet dog wandering near the coffee shop.',1,'2026-10-24','N/A','2026-10-24',1,'No collar, seems very friendly.',4,'https://ik.imagekit.io/mangenatee/petRescue/petrescue-1792842674346-dog_y0Unzr_sZ1.jpeg'),(384,NULL,NULL,'45 long street','i just found this pet',2,'2026-10-26','N/A','2026-10-26',1,'had a collar',3,'https://ik.imagekit.io/mangenatee/petRescue/petrescue-1793014735730-pexels-csibeman-19024664_rBGJnPJYr.jpg'),(386,501,3,'45 Long Street','Found a sweet dog wandering near the coffee shop.',121,'2026-10-24','N/A','2026-10-26',1,'No collar, seems very friendly.',3,NULL),(387,543,1,'15 Summerstrand Way','Found this exact dog wandering near the shops. Safe with me for now.',1,'2026-10-27','N/A','2026-10-27',1,NULL,3,NULL),(389,591,1,'123 main street','was near tuck shop',1,'2026-10-27','N/A','2026-10-27',NULL,NULL,9,NULL),(390,592,1,'main street','near road',1,'2026-10-27','N/A','2026-10-27',NULL,NULL,9,NULL),(391,588,1,'main street','someon',1,'2026-10-27','N/A','2026-10-27',NULL,NULL,9,NULL),(392,561,1,'15 Summerstrand Way','Found this exact dog wandering near the shops. Safe with me for now.',1,'2026-10-27','N/A','2026-10-27',1,NULL,9,NULL),(393,581,2,'somet street','gshshs',1,'2026-10-27','N/A','2026-10-27',1,NULL,9,NULL),(394,586,1,'sxgwh','something',1,'2026-10-27','N/A','2026-10-27',1,NULL,9,NULL),(395,523,2,'gvvh','esrdtf',1,'2026-10-27','N/A','2026-10-27',1,NULL,1,NULL),(396,590,1,'treet','wesdfcg',1,'2026-10-21','N/A','2026-10-27',1,NULL,1,NULL),(397,542,1,'dxfcgh','rtfgyh',1,'2026-10-20','N/A','2026-10-27',1,NULL,1,NULL),(398,594,1,'sdfghj','redtfy',1,'2026-10-26','N/A','2026-10-27',1,NULL,1,NULL),(399,593,5,'fdxgc','erdtgfh',121,'2026-10-26','N/A','2026-10-27',1,NULL,1,NULL),(400,595,35,'76 oxford street','It\'s anxious',121,'2026-10-26','N/A','2026-10-27',1,NULL,1,NULL);
/*!40000 ALTER TABLE `found_pet_report` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hand_over`
--

DROP TABLE IF EXISTS `hand_over`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hand_over` (
  `hoid` bigint NOT NULL AUTO_INCREMENT,
  `fpr_id` bigint DEFAULT NULL,
  `chosen_date` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `requested_at` date DEFAULT (curdate()),
  `response_note` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT 'N/A',
  `badge_title` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date_handed_over` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT 'N/A',
  `npo_spca_id` bigint DEFAULT NULL,
  `pet_id` bigint DEFAULT NULL,
  PRIMARY KEY (`hoid`),
  KEY `fk_09_hand_over` (`fpr_id`),
  KEY `fk_handover_spca` (`npo_spca_id`),
  KEY `fk_handover_pet` (`pet_id`),
  CONSTRAINT `fk_09_hand_over` FOREIGN KEY (`fpr_id`) REFERENCES `found_pet_report` (`fpr_id`),
  CONSTRAINT `fk_handover_pet` FOREIGN KEY (`pet_id`) REFERENCES `pet` (`pet_id`),
  CONSTRAINT `fk_handover_spca` FOREIGN KEY (`npo_spca_id`) REFERENCES `npo_spca` (`npo_spca_id`)
) ENGINE=InnoDB AUTO_INCREMENT=89 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hand_over`
--

LOCK TABLES `hand_over` WRITE;
/*!40000 ALTER TABLE `hand_over` DISABLE KEYS */;
INSERT INTO `hand_over` VALUES (61,361,'10/21/2026','2026-10-18','N/A','Handed Over','10/22/2026',1,281),(62,362,'10/20/2026','2026-10-18','N/A','Handed Over','10/22/2026',1,301),(63,364,'10/21/2026','2026-10-18','N/A','Handed Over','10/23/2026',1,302),(85,365,'2026-10-30T14:30:00.000Z','2026-10-27','Owner verified with ID and proof of ownership. Pet successfully handed over.','Handed Over','2026-10-27',2,306),(86,386,'2026-10-28','2026-10-27','something','Handed Over','2026-10-27',1,281),(87,399,'2026-10-27','2026-10-27','Owner verified with ID. Pet released.','Handed Over','2026-10-27',1,392),(88,400,'2026-10-27','2026-10-27','Owner verified with ID. Pet released.','Handed Over','2026-10-27',1,395);
/*!40000 ALTER TABLE `hand_over` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `itadmin`
--

DROP TABLE IF EXISTS `itadmin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `itadmin` (
  `itadmin_id` bigint NOT NULL AUTO_INCREMENT,
  `person_id` bigint DEFAULT NULL,
  `npo_spca_id` bigint DEFAULT NULL,
  PRIMARY KEY (`itadmin_id`),
  KEY `fk_10_itadmin` (`person_id`),
  KEY `fk_11_itadmin` (`npo_spca_id`),
  CONSTRAINT `fk_10_itadmin` FOREIGN KEY (`person_id`) REFERENCES `person` (`person_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_11_itadmin` FOREIGN KEY (`npo_spca_id`) REFERENCES `npo_spca` (`npo_spca_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `itadmin`
--

LOCK TABLES `itadmin` WRITE;
/*!40000 ALTER TABLE `itadmin` DISABLE KEYS */;
INSERT INTO `itadmin` VALUES (1,2,1),(2,10,2),(3,15,3);
/*!40000 ALTER TABLE `itadmin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `location`
--

DROP TABLE IF EXISTS `location`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `location` (
  `location_id` bigint NOT NULL AUTO_INCREMENT,
  `neighbourhood_id` bigint DEFAULT NULL,
  `street` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`location_id`),
  KEY `fk_12_location` (`neighbourhood_id`),
  CONSTRAINT `fk_12_location` FOREIGN KEY (`neighbourhood_id`) REFERENCES `neighbourhood` (`neighbourhood_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `location`
--

LOCK TABLES `location` WRITE;
/*!40000 ALTER TABLE `location` DISABLE KEYS */;
INSERT INTO `location` VALUES (1,40,'Premier Street'),(2,52,'Karoo Street'),(3,33,'Joseph Street'),(4,59,'Jackson Street'),(5,33,'Badela Road'),(6,47,'St Georges Street'),(7,30,'Belgravia Street'),(8,55,'Huston Street'),(9,38,'St Patricks Street'),(10,44,'Oxford Street'),(11,5,'Daku Street'),(12,22,'Kellson Road'),(13,16,'Kelly Street'),(14,10,'Selapho Street'),(15,28,'Crawford Road'),(16,8,'Cape Road'),(21,50,'Larry Street'),(22,35,'Shane Street');
/*!40000 ALTER TABLE `location` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `manager`
--

DROP TABLE IF EXISTS `manager`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `manager` (
  `manager_id` bigint NOT NULL AUTO_INCREMENT,
  `person_id` bigint DEFAULT NULL,
  `npo_spca_id` bigint DEFAULT NULL,
  PRIMARY KEY (`manager_id`),
  KEY `fk_13_manager` (`person_id`),
  KEY `fk_14_manager` (`npo_spca_id`),
  CONSTRAINT `fk_13_manager` FOREIGN KEY (`person_id`) REFERENCES `person` (`person_id`),
  CONSTRAINT `fk_14_manager` FOREIGN KEY (`npo_spca_id`) REFERENCES `npo_spca` (`npo_spca_id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `manager`
--

LOCK TABLES `manager` WRITE;
/*!40000 ALTER TABLE `manager` DISABLE KEYS */;
INSERT INTO `manager` VALUES (1,20,1),(2,16,2),(21,17,3);
/*!40000 ALTER TABLE `manager` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `member_npo_spca`
--

DROP TABLE IF EXISTS `member_npo_spca`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `member_npo_spca` (
  `mns_id` bigint NOT NULL AUTO_INCREMENT,
  `member_id` bigint DEFAULT NULL,
  `npo_spca_id` bigint DEFAULT NULL,
  `membership_no` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`mns_id`),
  UNIQUE KEY `uq_member_npo_spca_membership_no` (`membership_no`),
  KEY `fk_15_member_npo_spca` (`member_id`),
  KEY `fk_16_member_npo_spca` (`npo_spca_id`),
  CONSTRAINT `fk_15_member_npo_spca` FOREIGN KEY (`member_id`) REFERENCES `community_member` (`member_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_16_member_npo_spca` FOREIGN KEY (`npo_spca_id`) REFERENCES `npo_spca` (`npo_spca_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member_npo_spca`
--

LOCK TABLES `member_npo_spca` WRITE;
/*!40000 ALTER TABLE `member_npo_spca` DISABLE KEYS */;
INSERT INTO `member_npo_spca` VALUES (1,1,2,'BB-12345'),(2,2,1,'ELPP-67890'),(3,3,2,'BB-09876'),(4,4,1,'ELPP-54321'),(5,5,3,'SAP-10928'),(6,6,3,'SAP-56748'),(7,1,1,'ELPP-23896'),(8,2,2,'BB-56123'),(9,3,1,'ELPP-67321'),(10,4,2,'BB-45332');
/*!40000 ALTER TABLE `member_npo_spca` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `missing_pet_incident`
--

DROP TABLE IF EXISTS `missing_pet_incident`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `missing_pet_incident` (
  `mpi_id` bigint NOT NULL AUTO_INCREMENT,
  `pet_id` bigint DEFAULT NULL,
  `missing_reason_id` bigint DEFAULT NULL,
  `last_seen_date` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `submitted_at` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `org_neighbourhood_id` bigint DEFAULT NULL,
  `predicted_street` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `incident_status_id` bigint DEFAULT NULL,
  `urgency_level_id` bigint DEFAULT NULL,
  `reward_offered` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT 'N/A',
  `incident_description` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `recent_wellbeing_id` bigint DEFAULT NULL,
  `other_desc` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `for_public` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`mpi_id`),
  KEY `fk_17_missing_pet_incident` (`pet_id`),
  KEY `fk_18_missing_pet_incident` (`missing_reason_id`),
  KEY `fk_19_missing_pet_incident` (`recent_wellbeing_id`),
  KEY `fk_20_missing_pet_incident` (`org_neighbourhood_id`),
  KEY `fk_21_missing_pet_incident` (`incident_status_id`),
  KEY `fk_22_missing_pet_incident` (`urgency_level_id`),
  CONSTRAINT `fk_17_missing_pet_incident` FOREIGN KEY (`pet_id`) REFERENCES `pet` (`pet_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_18_missing_pet_incident` FOREIGN KEY (`missing_reason_id`) REFERENCES `reason` (`reason_id`),
  CONSTRAINT `fk_19_missing_pet_incident` FOREIGN KEY (`recent_wellbeing_id`) REFERENCES `wellbeing_description` (`wellbeing_id`),
  CONSTRAINT `fk_20_missing_pet_incident` FOREIGN KEY (`org_neighbourhood_id`) REFERENCES `npo_spca_neighbourhood` (`nsn_id`),
  CONSTRAINT `fk_21_missing_pet_incident` FOREIGN KEY (`incident_status_id`) REFERENCES `activity_status` (`ats_id`),
  CONSTRAINT `fk_22_missing_pet_incident` FOREIGN KEY (`urgency_level_id`) REFERENCES `urgency_level` (`urgency_id`)
) ENGINE=InnoDB AUTO_INCREMENT=596 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `missing_pet_incident`
--

LOCK TABLES `missing_pet_incident` WRITE;
/*!40000 ALTER TABLE `missing_pet_incident` DISABLE KEYS */;
INSERT INTO `missing_pet_incident` VALUES (501,281,6,'10/15/2026','10/18/2026',36,'Flakken Street',2,1,'None','Lost while at the shopping local mall',282,NULL,0),(521,301,4,'10/14/2026','10/18/2026',65,'Golie Road',2,2,'R250','Lost in the recent flood in my street',3,NULL,0),(522,302,6,'10/14/2026','10/18/2026',35,'Rollins Road',2,1,'None','Lost while at the local beach near the casino',4,NULL,0),(523,341,6,'10/15/2026','10/19/2026',52,'Neon Street',2,3,'None','Pet left the property when a visitor accidentally left the gate open.',12,NULL,0),(542,303,6,'10/12/2026','10/18/2026',68,'Familia Road',2,2,'None','Pet escaped through an open gate during the early morning hours.',10,NULL,0),(543,304,10,'10/18/2026','10/19/2026',49,'Junie Street',2,1,'None','Pet wandered away during a family visit to a nearby park.',2,NULL,0),(544,306,6,'10/16/2026','10/19/2026',51,'Lorrie Street',2,1,'None','Pet escaped from a damaged section of the boundary fence.',282,NULL,0),(561,361,2,'10/13/2026','10/20/2026',51,'Sacremento Street',2,2,'None','Stolen at the zoo nearby',11,NULL,0),(581,381,1,'10/13/2026','10/20/2026',5,'Goffer Street',2,3,'None','Pet was frightened by fireworks and ran from the property.',282,NULL,0),(585,382,5,'10/14/2026','10/20/2026',4,'Hallen Street',2,2,'R150','Pet became separated from the owner while travelling.',381,'Weak in energy yet curious of surroundings',0),(586,383,4,'10/16/2026','10/20/2026',8,'Talent Street',2,3,'None','Pet lost in the recent street flood',2,NULL,0),(588,386,1,'2026-10-24','2026-10-24',5,'123 Main Street',2,2,'R500','Slipped out through the front gate.',1,'Wearing a red collar with a silver tag.',0),(590,281,1,'2026-10-25','2026-10-26',49,'Main street',2,2,'200','it just disappeared',1,NULL,0),(591,390,1,'2026-10-26','2026-10-27',2,'Main street',2,2,'none','was last seen outside my house',1,NULL,0),(592,391,1,'2026-10-26','2026-10-27',2,'Main street',2,2,'none','something',1,NULL,0),(593,392,1,'2026-10-26','2026-10-27',2,'rdtfygh',2,2,'100','rdtfyghu',1,'dtrfgyu',0),(594,321,1,'2026-10-26','2026-10-27',2,'rdtfgy',2,2,'rdtfygu','rdtfg',1,NULL,0),(595,395,3,'2026-10-20','2026-10-27',35,'3 st micheals road',2,2,'R400','Accidental release while driving in the m1 freeway',1,NULL,0);
/*!40000 ALTER TABLE `missing_pet_incident` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `neighbourhood`
--

DROP TABLE IF EXISTS `neighbourhood`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `neighbourhood` (
  `neighbourhood_id` bigint NOT NULL AUTO_INCREMENT,
  `city_id` bigint DEFAULT NULL,
  `neighbourhood_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`neighbourhood_id`),
  KEY `fk_23_neighbourhood` (`city_id`),
  CONSTRAINT `fk_23_neighbourhood` FOREIGN KEY (`city_id`) REFERENCES `city` (`city_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `neighbourhood`
--

LOCK TABLES `neighbourhood` WRITE;
/*!40000 ALTER TABLE `neighbourhood` DISABLE KEYS */;
INSERT INTO `neighbourhood` VALUES (1,40,'Summerstrand'),(2,40,'Walmer'),(3,40,'Mill Park'),(4,40,'Lorraine'),(5,40,'Humewood'),(6,40,'Bluewater Bay'),(7,40,'Westering'),(8,40,'Newton Park'),(9,40,'Algoa Park'),(10,40,'Bethelsdorp'),(11,40,'Motherwell'),(12,40,'Kabega Park'),(13,40,'Fairview'),(14,40,'Mount Croix'),(15,40,'Korsten'),(16,40,'Parsons Hill'),(17,40,'Sunridge Park'),(18,40,'Lovemore Heights'),(19,40,'Bluewater Bay North'),(20,40,'Walmer Park'),(21,40,'Kamma Park'),(22,40,'Algoa Park North'),(23,40,'Strandfontein'),(24,40,'Seaview'),(25,40,'Walmer Heights'),(26,40,'Kabega'),(27,40,'Bethelsdorp North'),(28,40,'Motherwell East'),(29,40,'Gqeberha Central'),(30,41,'Quigney'),(31,41,'Southernwood'),(32,41,'Belgravia'),(33,41,'Amalinda'),(34,41,'Chiselhurst'),(35,41,'Beacon Bay'),(36,41,'Berea'),(37,41,'Arcadia'),(38,41,'North End'),(39,41,'Beaconhurst'),(40,41,'Nahoon'),(41,41,'Gonubie'),(42,41,'Mdantsane'),(43,41,'Potsdam'),(44,41,'Duncan Village'),(45,41,'Bunkers Hill'),(46,41,'Sunnyridge'),(47,41,'Rosemount'),(48,41,'Fullers Bay'),(49,41,'Wilsonia'),(50,41,'Quenera'),(51,41,'Woodleigh'),(52,41,'Parkridge'),(53,41,'Brookville'),(54,41,'Saxilby'),(55,41,'Cambridge'),(56,41,'Baysville'),(57,41,'Selborne'),(58,41,'Gompo'),(59,41,'Haven Hills'),(60,NULL,'None');
/*!40000 ALTER TABLE `neighbourhood` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `npo_spca`
--

DROP TABLE IF EXISTS `npo_spca`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `npo_spca` (
  `npo_spca_id` bigint NOT NULL AUTO_INCREMENT,
  `npo_spca_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `org_type_id` bigint DEFAULT NULL,
  `location_id` bigint DEFAULT NULL,
  PRIMARY KEY (`npo_spca_id`),
  KEY `fk_24_npo_spca` (`org_type_id`),
  KEY `fk_25_npo_spca` (`location_id`),
  CONSTRAINT `fk_24_npo_spca` FOREIGN KEY (`org_type_id`) REFERENCES `organization_type` (`org_type_id`),
  CONSTRAINT `fk_25_npo_spca` FOREIGN KEY (`location_id`) REFERENCES `location` (`location_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `npo_spca`
--

LOCK TABLES `npo_spca` WRITE;
/*!40000 ALTER TABLE `npo_spca` DISABLE KEYS */;
INSERT INTO `npo_spca` VALUES (1,'EL Pet Pals','0649494191','elpetpals8@gmail.com','5/5/2026',1,21),(2,'Beachon Bay','0815342243','beachonbay@gmail.com','5/5/2026',1,22),(3,'Save-A-Pet Animal Shelter','0817023487','saveapet@gmail.com','5/5/2026',2,16);
/*!40000 ALTER TABLE `npo_spca` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `npo_spca_neighbourhood`
--

DROP TABLE IF EXISTS `npo_spca_neighbourhood`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `npo_spca_neighbourhood` (
  `nsn_id` bigint NOT NULL AUTO_INCREMENT,
  `npo_spca_id` bigint DEFAULT NULL,
  `neighbourhood_id` bigint DEFAULT NULL,
  PRIMARY KEY (`nsn_id`),
  KEY `fk_26_npo_spca_neighbourhood` (`npo_spca_id`),
  KEY `fk_27_npo_spca_neighbourhood` (`neighbourhood_id`),
  CONSTRAINT `fk_26_npo_spca_neighbourhood` FOREIGN KEY (`npo_spca_id`) REFERENCES `npo_spca` (`npo_spca_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_27_npo_spca_neighbourhood` FOREIGN KEY (`neighbourhood_id`) REFERENCES `neighbourhood` (`neighbourhood_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=262 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `npo_spca_neighbourhood`
--

LOCK TABLES `npo_spca_neighbourhood` WRITE;
/*!40000 ALTER TABLE `npo_spca_neighbourhood` DISABLE KEYS */;
INSERT INTO `npo_spca_neighbourhood` VALUES (2,3,1),(3,3,2),(4,3,4),(5,3,5),(6,3,6),(7,3,10),(8,3,11),(9,3,12),(10,3,17),(11,3,22),(12,3,26),(13,3,28),(14,3,29),(21,3,3),(22,3,7),(23,3,8),(24,3,9),(25,3,13),(26,3,14),(27,3,18),(28,3,19),(29,3,20),(30,3,21),(31,3,23),(32,3,24),(33,3,27),(34,1,30),(35,1,31),(36,1,32),(37,1,33),(38,1,34),(39,1,35),(40,1,36),(41,1,37),(42,1,38),(43,1,39),(44,1,40),(45,1,41),(46,1,42),(47,1,43),(48,1,44),(49,2,45),(50,2,46),(51,2,47),(52,2,48),(53,2,49),(54,2,50),(55,2,51),(56,2,52),(57,2,53),(58,2,54),(59,2,55),(60,2,56),(61,2,57),(62,2,58),(63,2,59),(64,1,45),(65,1,47),(66,1,49),(67,1,51),(68,2,32),(69,2,34),(70,2,36),(71,2,38),(261,3,16);
/*!40000 ALTER TABLE `npo_spca_neighbourhood` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `organization_type`
--

DROP TABLE IF EXISTS `organization_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `organization_type` (
  `org_type_id` bigint NOT NULL AUTO_INCREMENT,
  `org_type_name` varchar(60) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`org_type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `organization_type`
--

LOCK TABLES `organization_type` WRITE;
/*!40000 ALTER TABLE `organization_type` DISABLE KEYS */;
INSERT INTO `organization_type` VALUES (1,'Non Profit Organization (NPO)'),(2,'Society for the Prevention of Cruelty to Animals (SPCA)'),(21,'Veterinary');
/*!40000 ALTER TABLE `organization_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `owner_npo_spca`
--

DROP TABLE IF EXISTS `owner_npo_spca`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `owner_npo_spca` (
  `ons_id` bigint NOT NULL AUTO_INCREMENT,
  `pet_owner_id` bigint DEFAULT NULL,
  `npo_spca_id` bigint DEFAULT NULL,
  PRIMARY KEY (`ons_id`),
  KEY `fk_28_owner_npo_spca` (`pet_owner_id`),
  KEY `fk_29_owner_npo_spca` (`npo_spca_id`),
  CONSTRAINT `fk_28_owner_npo_spca` FOREIGN KEY (`pet_owner_id`) REFERENCES `pet_owner` (`owner_id`),
  CONSTRAINT `fk_29_owner_npo_spca` FOREIGN KEY (`npo_spca_id`) REFERENCES `npo_spca` (`npo_spca_id`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `owner_npo_spca`
--

LOCK TABLES `owner_npo_spca` WRITE;
/*!40000 ALTER TABLE `owner_npo_spca` DISABLE KEYS */;
INSERT INTO `owner_npo_spca` VALUES (3,1,1),(4,21,1),(5,1,2),(6,2,2),(7,3,3),(21,21,2),(22,22,2),(23,23,3),(41,2,1),(42,22,1);
/*!40000 ALTER TABLE `owner_npo_spca` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `person`
--

DROP TABLE IF EXISTS `person`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `person` (
  `person_id` bigint NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `username` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contact_pref_id` bigint DEFAULT NULL,
  `location_id` bigint DEFAULT NULL,
  `role` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_onboarded` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`person_id`),
  UNIQUE KEY `uq_person_username` (`username`),
  KEY `fk_30_person` (`contact_pref_id`),
  KEY `fk_31_person` (`location_id`),
  CONSTRAINT `fk_30_person` FOREIGN KEY (`contact_pref_id`) REFERENCES `contact_preference` (`preference_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_31_person` FOREIGN KEY (`location_id`) REFERENCES `location` (`location_id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `person`
--

LOCK TABLES `person` WRITE;
/*!40000 ALTER TABLE `person` DISABLE KEYS */;
INSERT INTO `person` VALUES (1,'Olwethu','Vani','pet_owner1_el','$2b$10$ilKg0txs4coZlPFsHSA0aOUFEGYuL8TDSJE9SAG.ngFNjAM4aMQE2','https://ui-avatars.com/api/?name=Olwethu+Vani&background=random','ovani@gmail.com','0821234567','3/5/2026',1,1,'pet_owner',1),(2,'Tracy','Lorence','admin','$2b$10$ilKg0txs4coZlPFsHSA0aOUFEGYuL8TDSJE9SAG.ngFNjAM4aMQE2','https://ui-avatars.com/api/?name=Tracy+Lorence&background=random','tl@gmail.com','0415564560','3/5/2026',21,2,'itadmin',1),(3,'Lamine','Yamal','member_bb','$2b$10$ilKg0txs4coZlPFsHSA0aOUFEGYuL8TDSJE9SAG.ngFNjAM4aMQE2','https://ui-avatars.com/api/?name=Lamine+Yamal&background=random','yamal@gmail.com','0817463552','3/5/2026',41,3,'community_member',1),(4,'Phil','Phoden','member_el','$2b$10$ilKg0txs4coZlPFsHSA0aOUFEGYuL8TDSJE9SAG.ngFNjAM4aMQE2','https://ui-avatars.com/api/?name=Phil+Phoden&background=random','phoden@gmail.com','0786526173','3/5/2026',41,4,'community_member',1),(5,'Kamvelihle','Bavuma','member','$2b$10$ilKg0txs4coZlPFsHSA0aOUFEGYuL8TDSJE9SAG.ngFNjAM4aMQE2','https://ui-avatars.com/api/?name=Kamvelihle+Bavuma&background=random','kbavuma40@gmail.com','0717225308','3/5/2026',41,5,'community_member',1),(6,'Gabriel','Khumalo','pet_owner2_el','$2b$10$ilKg0txs4coZlPFsHSA0aOUFEGYuL8TDSJE9SAG.ngFNjAM4aMQE2','https://ui-avatars.com/api/?name=Gabriel+Khumalo&background=random','gabrielk@gmail.com','0782362779','3/5/2026',1,6,'pet_owner',1),(7,'John','Dube','pet_owner1_bb','$2b$10$ilKg0txs4coZlPFsHSA0aOUFEGYuL8TDSJE9SAG.ngFNjAM4aMQE2','https://ui-avatars.com/api/?name=John+Dube&background=random','johndube@gmail.com','0787365233','3/5/2026',1,7,'pet_owner',1),(8,'Tebatso','Mangena','tm_member','$2b$10$ilKg0txs4coZlPFsHSA0aOUFEGYuL8TDSJE9SAG.ngFNjAM4aMQE2','https://ui-avatars.com/api/?name=Tebatso+Mangena&background=random','tmangena@gmail.com','0649494191','3/5/2026',41,8,'community_member',1),(9,'Simon','Andrew','pet_owner2_bb','$2b$10$ilKg0txs4coZlPFsHSA0aOUFEGYuL8TDSJE9SAG.ngFNjAM4aMQE2','https://ui-avatars.com/api/?name=Simon+Andrew&background=random','simon@gmail.com','0812239489','3/5/2026',1,9,'pet_owner',1),(10,'Ryan','Nel','admin2','$2b$10$ilKg0txs4coZlPFsHSA0aOUFEGYuL8TDSJE9SAG.ngFNjAM4aMQE2','https://ui-avatars.com/api/?name=Ryan+Nel&background=random','ryannel@gmail.com','0716452266','3/5/2026',21,10,'itadmin',1),(11,'Shawn','Diego','member1_sap','$2b$10$ilKg0txs4coZlPFsHSA0aOUFEGYuL8TDSJE9SAG.ngFNjAM4aMQE2','https://ui-avatars.com/api/?name=Shawn+Diego&background=random','shawn@gmail.com','0718237446','5/5/2026',21,11,'community_member',1),(12,'Kabelo','Vellem','member2_sap','$2b$10$ilKg0txs4coZlPFsHSA0aOUFEGYuL8TDSJE9SAG.ngFNjAM4aMQE2','https://ui-avatars.com/api/?name=Kabelo+Vellem&background=random','kabelov@gmail.com','0812634435','6/5/2026',1,14,'community_member',1),(13,'Andy','Smith','pet_owner1_sap','$2b$10$ilKg0txs4coZlPFsHSA0aOUFEGYuL8TDSJE9SAG.ngFNjAM4aMQE2','https://ui-avatars.com/api/?name=Andy+Smith&background=random','andys@gmail.com','0789958234','7/5/2026',41,12,'pet_owner',1),(14,'Jude','Larson','pet_owner2_sap','$2b$10$ilKg0txs4coZlPFsHSA0aOUFEGYuL8TDSJE9SAG.ngFNjAM4aMQE2','https://ui-avatars.com/api/?name=Jude+Larson&background=random','judel@gmail.com','0642531123','7/5/2026',21,13,'pet_owner',1),(15,'Simthembile','Noah','admin3','$2b$10$ilKg0txs4coZlPFsHSA0aOUFEGYuL8TDSJE9SAG.ngFNjAM4aMQE2','https://ui-avatars.com/api/?name=Simthembile+Noah&background=random','simthembilen@gmail.com','0712309918','4/5/2026',21,15,'itadmin',1),(16,'Ryan','Nel','manager_bb','$2b$10$ilKg0txs4coZlPFsHSA0aOUFEGYuL8TDSJE9SAG.ngFNjAM4aMQE2','https://ui-avatars.com/api/?name=Ryan+Nel&background=random','ryannel@gmail.com','0783949584','3/5/2026',21,22,'manager',1),(17,'Johannes','Larry','manager_sap','$2b$10$ilKg0txs4coZlPFsHSA0aOUFEGYuL8TDSJE9SAG.ngFNjAM4aMQE2','https://ui-avatars.com/api/?name=Johannes+Larry&background=random','johanneslarry@gmail.com','0612738903','3/5/2026',21,13,'manager',1),(20,'Tracy','Lorence','manager_el','$2b$10$ilKg0txs4coZlPFsHSA0aOUFEGYuL8TDSJE9SAG.ngFNjAM4aMQE2','https://ui-avatars.com/api/?name=Tracy+Lorence&background=random','tracyl@gmail.com','0786352267','3/5/2026',21,7,'manager',1),(21,'Tebza','Mangena','Tebza21','$2b$10$b3f5S7BV3FcBlIja4QLghe1BNSME4mcwpLKrMb0.KEWMkFZUHdPmK','https://ui-avatars.com/api/?name=Tebza+Mangena&background=random','teb@gmail.com','0649494191','2026-10-23',21,10,'pet_owner',1),(22,'Jack','Jones','Jack','$2b$10$SpXAN0HJA4f6CfEyNu.HcujB/UUFi6HgnN2IcdLcdi/Yu8D5J9GKq','https://ui-avatars.com/api/?name=Jack+Jones&background=random','jack@gmail.com','0649494191','2026-10-23',21,10,'pet_owner',1),(23,'phil','kelpin','phil','$2b$10$mJsiPqNOicOtJ7gDzdA3t.4MXX.f3nXMH8KKJ2V2lOJPrS4hwY2y2','https://ui-avatars.com/api/?name=phil+kelpin&background=random','phil@gmail.com','0649494193','2026-10-25',21,10,'community_member',1),(24,'Thabo','Maake','Thabo','$2b$10$hb0xKYquTPl0nLD0z8ZU6OowtzWQ2HrluY6aZkuA1.0FvGP249cXG','https://ui-avatars.com/api/?name=Thabo+Maake&background=random','thabo@gmail.com','0642344321','2026-10-25',21,1,'pet_owner',1),(25,'Kelvin','Herry','Kelvin','$2b$10$u9jH/usOZxibo7zTxgBo7eaPMbPddYIifndtgv7IofuQ7Zj.HmPfW','https://ui-avatars.com/api/?name=Kelvin+Herry&background=random','kelvin@gmail.com','0642344321','2026-10-25',21,2,'community_member',1),(26,'jane','rushy','jane','$2b$10$F038bVcC6jbP7JLPLHvDsOv9oxLDVeRP3bDJbbYw7S.39agolmE0S','https://ui-avatars.com/api/?name=jane+rushy&background=random','jane@gmail.com','0645323321','2026-10-27',3,3,'pet_owner',1),(27,'joseph','rushy','joseph','$2b$10$YtkqnMzDco9Q7AuoyrcLNe31ZeFV.ThRs2xbsafHjYsfJLsJwBTJa','https://ui-avatars.com/api/?name=joseph+rushy&background=random','joseph@gmail.com','0645323322','2026-10-27',1,3,'community_member',1),(28,'Milisa','Makaula','Mili','$2b$10$bbMkx8jQlVMxN5ECNRCVuOvImW9d6OlSEfQdPfTTxELSGgoyJR646','https://ui-avatars.com/api/?name=Milisa+Makaula&background=random','milisamakaula@icloud.com','0769858902','2026-10-27',1,7,'pet_owner',1);
/*!40000 ALTER TABLE `person` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pet`
--

DROP TABLE IF EXISTS `pet`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pet` (
  `pet_id` bigint NOT NULL AUTO_INCREMENT,
  `pet_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `species_id` bigint DEFAULT NULL,
  `pet_colour_id` bigint DEFAULT NULL,
  `pet_size_id` bigint DEFAULT NULL,
  `ownership` varchar(5) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pet_description` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `registered_at` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pet_status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pet_owner_id` bigint DEFAULT NULL,
  `image_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`pet_id`),
  KEY `fk_32_pet` (`pet_owner_id`),
  KEY `fk_33_pet` (`species_id`),
  KEY `fk_34_pet` (`pet_colour_id`),
  KEY `fk_35_pet` (`pet_size_id`),
  CONSTRAINT `fk_32_pet` FOREIGN KEY (`pet_owner_id`) REFERENCES `pet_owner` (`owner_id`),
  CONSTRAINT `fk_33_pet` FOREIGN KEY (`species_id`) REFERENCES `pet_species` (`species_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_34_pet` FOREIGN KEY (`pet_colour_id`) REFERENCES `pet_colour` (`colour_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_35_pet` FOREIGN KEY (`pet_size_id`) REFERENCES `pet_size` (`size_id`)
) ENGINE=InnoDB AUTO_INCREMENT=396 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pet`
--

LOCK TABLES `pet` WRITE;
/*!40000 ALTER TABLE `pet` DISABLE KEYS */;
INSERT INTO `pet` VALUES (281,'Whisker',2,17,13,'Owned','Likes to stare at others','10/18/2026','Found / Awaiting Handover',1,'https://res.cloudinary.com/kj4ftyvs/image/upload/v1792284398/rv4slfwzdyzg3dlxi8no.jpg'),(301,'Rex',1,2,12,'Owned','Likes to eat a lot','10/18/2026','Currently Found by a Community Member',21,'https://res.cloudinary.com/kj4ftyvs/image/upload/v1792352209/rxb8cbqktu0ddfa8hmns.jpg'),(302,'Buddy',1,3,14,'Owned','Likes to chase some randomly','10/18/2026','Currently at Home',22,'https://res.cloudinary.com/kj4ftyvs/image/upload/v1792359569/eoqljh3cdou4tybsuzb8.jpg'),(303,'Rocky',1,3,13,'Owned','Medium-sized brown dog with a white patch on the chest and short fur.','10/18/2026','Found / Awaiting Handover',1,'https://res.cloudinary.com/kj4ftyvs/image/upload/v1792365508/uec8pwewrwghwwaored3.jpg'),(304,'Bruno',1,4,13,'Owned','Golden-coated dog with a bushy tail and energetic personality.','10/19/2026','Found / Awaiting Handover',2,'https://res.cloudinary.com/kj4ftyvs/image/upload/v1792375326/xmgqolvwcbac1gjgrgdo.jpg'),(305,'Milo',2,13,12,'Owned','Orange tabby cat with green eyes and striped fur.','10/19/2026','Currently at Home',2,'https://res.cloudinary.com/kj4ftyvs/image/upload/v1792375905/j6ab1pk41ovo98wzqbhs.jpg'),(306,'Toby',1,2,12,'Owned','Small white terrier with curly fur and a blue collar.','10/19/2026','Reunited with Owner',1,'https://res.cloudinary.com/kj4ftyvs/image/upload/v1792376869/fhwhtibwgpb28ko4nss4.jpg'),(321,'Lucy',2,2,12,'Owned','Likes to climb trees','10/18/2026','Found / Awaiting Handover',21,'https://res.cloudinary.com/kj4ftyvs/image/upload/v1792354040/zjlxxhpqmcr9b67jdnl4.jpg'),(341,'Coco',2,12,14,'Owned','Large tabby cat with distinctive markings on the forehead.','10/19/2026','Found / Awaiting Handover',22,'https://res.cloudinary.com/kj4ftyvs/image/upload/v1792376509/ld2dpv1whfq00cwiyzun.jpg'),(361,'Bella',2,3,12,'Owned','Naturally gifted with acrobatics','10/20/2026','Found / Awaiting Handover',21,'https://res.cloudinary.com/kj4ftyvs/image/upload/v1792493866/envaiajdlshkjivbq9ru.jpg'),(362,'Shadow',2,2,12,'Owned','Black and white cat wearing a bell collar.','10/20/2026','Currently at Home',3,'https://res.cloudinary.com/kj4ftyvs/image/upload/v1792495130/u2uhor5udelsjbyyj4lj.jpg'),(381,'Benji',1,2,14,'Owned','White dog with brown spots and a distinctive scar above the right eye.','10/20/2026','Found / Awaiting Handover',3,'https://res.cloudinary.com/kj4ftyvs/image/upload/v1792494670/xg5vdsqivzd4fmcz8bxy.jpg'),(382,'Chloe',2,13,13,'Owned','Orange and white cat with a fluffy coat.','10/20/2026','Currently Found by a Community Member',23,'https://res.cloudinary.com/kj4ftyvs/image/upload/v1792495347/n5a7n7g8qbl8b0mqfs8m.png'),(383,'Oscar',1,2,11,'Owned','Young puppy with white fur and a curious nature.','10/20/2026','Found / Awaiting Handover',23,'https://res.cloudinary.com/kj4ftyvs/image/upload/v1792495462/sgmqjjcdspvynshgtqzq.jpg'),(384,'Leo',2,4,12,'Owned','Likes to lick the feet of people.','10/20/2026','Currently at Home',23,'https://res.cloudinary.com/kj4ftyvs/image/upload/v1792496063/msqen0adbfpnpzymvaob.jpg'),(386,'Luna',1,3,11,'Owned','A very friendly mixed breed. She has a distinct white patch on her chest and loves chasing tennis balls.','2026-10-23','Found / Awaiting Handover',25,'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500'),(389,'donald',1,3,12,'Owned','donald is a very smart dog','2026-10-26','Currently at Home',1,'https://ik.imagekit.io/mangenatee/petRescue/petrescue-1792997842269-dog_Jb3jXdUzV.jpeg'),(390,'tax',1,5,14,'Owned','Tax the bull','2026-10-27','Found / Awaiting Handover',29,'https://ik.imagekit.io/mangenatee/petRescue/petrescue-1793109022644-richard-brutyo-Sg3XwuEpybU-unsplash_ta7MdznFr.jpg'),(391,'micky',1,17,12,'Owned','is just a dog','2026-10-27','Found / Awaiting Handover',29,'https://ik.imagekit.io/mangenatee/petRescue/petrescue-1793110932944-victor-g-N04FIfHhv_k-unsplash_sin5q2dKI.jpg'),(392,'daniel',1,1,12,'Owned','the pretty dog','2026-10-27','Currently at Home',21,'https://ik.imagekit.io/mangenatee/petRescue/petrescue-1793117721731-daniel-j-schwarz-XAfyShV-bAo-unsplash_YEDGQrcYu.jpg'),(393,'tehds',1,1,12,'Owned','dfghj','2026-10-27','Currently at Home',21,'https://ik.imagekit.io/mangenatee/petRescue/petrescue-1793117837006-richard-brutyo-Sg3XwuEpybU-unsplash__x2X2QRrE.jpg'),(395,'Rainy',1,3,14,'Owned','Good dog','2026-10-27','Currently at Home',30,'https://ik.imagekit.io/mangenatee/petRescue/petrescue-1793122082281-pexels-csibeman-19024664_YrTbDylf2.jpg');
/*!40000 ALTER TABLE `pet` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pet_colour`
--

DROP TABLE IF EXISTS `pet_colour`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pet_colour` (
  `colour_id` bigint NOT NULL AUTO_INCREMENT,
  `colour_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`colour_id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pet_colour`
--

LOCK TABLES `pet_colour` WRITE;
/*!40000 ALTER TABLE `pet_colour` DISABLE KEYS */;
INSERT INTO `pet_colour` VALUES (1,'Black'),(2,'White'),(3,'Brown'),(4,'Golden'),(5,'Cream'),(6,'Blue'),(7,'Red'),(8,'Brindle'),(9,'Merle'),(10,'Harlequin'),(11,'Tri-coloured'),(12,'Gray'),(13,'Orange'),(14,'Calico'),(15,'Tortoiseshell'),(16,'Tabby'),(17,'Bi-coloured'),(18,'Pointed'),(19,'Silver Shaded'),(20,'Green'),(21,'Yellow'),(22,'Albino'),(23,'Pied'),(24,'Lutino'),(25,'Leucistic'),(26,'Hypo'),(27,'Normal'),(28,'Patternless'),(29,'Striped'),(30,'Speckled');
/*!40000 ALTER TABLE `pet_colour` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pet_owner`
--

DROP TABLE IF EXISTS `pet_owner`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pet_owner` (
  `owner_id` bigint NOT NULL AUTO_INCREMENT,
  `person_id` bigint DEFAULT NULL,
  PRIMARY KEY (`owner_id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pet_owner`
--

LOCK TABLES `pet_owner` WRITE;
/*!40000 ALTER TABLE `pet_owner` DISABLE KEYS */;
INSERT INTO `pet_owner` VALUES (1,1),(2,9),(3,13),(21,6),(22,7),(23,14),(24,21),(25,22),(26,22),(27,22),(28,24),(29,26),(30,28);
/*!40000 ALTER TABLE `pet_owner` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pet_size`
--

DROP TABLE IF EXISTS `pet_size`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pet_size` (
  `size_id` bigint NOT NULL AUTO_INCREMENT,
  `size_name` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `size_description` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`size_id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pet_size`
--

LOCK TABLES `pet_size` WRITE;
/*!40000 ALTER TABLE `pet_size` DISABLE KEYS */;
INSERT INTO `pet_size` VALUES (11,'Extra Small','Tiny pets such as toy breeds, pocket pets, or very young kittens'),(12,'Small','Small pets like small dogs, cats, rabbits, or guinea pigs'),(13,'Medium','Average-sized pets such as beagles, larger cats, or medium rabbits'),(14,'Large','Large pets including labradors, retrievers, or bigger cats'),(15,'Giant','Very large breeds such as Great Danes, Mastiffs, or giant tortoises'),(16,'Toy','Miniature or toy breeds like Chihuahuas or Yorkshire Terriers'),(17,'Juvenile','Young pets that are not yet fully grown, e.g., puppies or kittens'),(18,'Senior','Older pets, often smaller or less active due to age'),(19,'Exotic Small','Small exotic pets such as hedgehogs, ferrets, or small reptiles'),(20,'Exotic Large','Larger exotic pets such as iguanas, parrots, or tortoises');
/*!40000 ALTER TABLE `pet_size` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pet_species`
--

DROP TABLE IF EXISTS `pet_species`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pet_species` (
  `species_id` bigint NOT NULL AUTO_INCREMENT,
  `species_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`species_id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pet_species`
--

LOCK TABLES `pet_species` WRITE;
/*!40000 ALTER TABLE `pet_species` DISABLE KEYS */;
INSERT INTO `pet_species` VALUES (1,'Dog'),(2,'Cat'),(3,'Rabbit'),(4,'Hamster'),(5,'Guinea Pig'),(6,'Ferret'),(7,'Parrot'),(10,'Lovebird'),(11,'Finch'),(12,'Goldfish'),(13,'Betta'),(14,'Guppy'),(15,'Angelfish'),(17,'Turtle'),(18,'Tortoise'),(19,'Iguana'),(22,'Snake'),(23,'Frog'),(24,'Salamander'),(26,'Hedgehog'),(27,'Chinchilla'),(28,'Mouse');
/*!40000 ALTER TABLE `pet_species` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reason`
--

DROP TABLE IF EXISTS `reason`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reason` (
  `reason_id` bigint NOT NULL AUTO_INCREMENT,
  `activity_type_id` bigint DEFAULT NULL,
  `reason_description` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`reason_id`),
  KEY `fk_36_reason` (`activity_type_id`),
  CONSTRAINT `fk_36_reason` FOREIGN KEY (`activity_type_id`) REFERENCES `activity_type` (`type_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reason`
--

LOCK TABLES `reason` WRITE;
/*!40000 ALTER TABLE `reason` DISABLE KEYS */;
INSERT INTO `reason` VALUES (1,1,'Escaped - Pet broke free from enclosure or home'),(2,1,'Stolen - Pet taken unlawfully by another person'),(3,1,'Accidental Release - Pet unintentionally let out by owner or others'),(4,1,'Natural Disaster - Pet lost during events like floods, fires, or earthquakes'),(5,1,'Transport Incident - Pet lost during travel in vehicle, plane, or train'),(6,1,'Negligence - Pet lost due to lack of proper care or attention'),(7,1,'Unknown - Cause of disappearance cannot be determined'),(8,1,'Abandoned - Pet intentionally left behind by owner'),(9,1,'Wandered Off - Pet strayed away from home or yard'),(10,1,'Lost During Walk - Pet slipped leash or ran off while being walked'),(11,1,'Lost at Event - Pet disappeared during a public or private gathering'),(12,1,'Lost at Vet Visit - Pet escaped or went missing during veterinary appointment'),(13,1,'Lost at Boarding - Pet disappeared while staying at boarding facility'),(14,1,'Lost During Move - Pet lost in the process of relocating homes'),(15,1,'Lost at Market - Pet went missing in crowded shopping or market area'),(16,1,'Lost During Travel - Pet lost while on trip or vacation'),(17,1,'Lost at Beach - Pet disappeared during beach outing'),(18,1,'Lost in Countryside - Pet wandered off in rural or open land'),(19,1,'Lost During Holiday - Pet lost while family was away on holiday'),(20,1,'Lost at School - Pet went missing during visit to school grounds'),(21,1,'Lost During Storm - Pet disappeared during severe weather conditions'),(22,2,'Pet appears injured and needs medical care'),(23,2,'Pet owner or reporter of the pet as missing is not available via contact'),(24,2,'Pet is malnourished or neglected'),(25,2,'Pet is a stray with no visible owner nearby'),(26,2,'Pet has been wandering in traffic and is unsafe'),(27,2,'Pet was found abandoned intentionally'),(28,2,'Pet is aggressive or poses a danger if left unattended'),(29,2,'Pet is lost and has an identification tag or microchip'),(30,2,'Pet was found during a natural disaster or emergency'),(31,2,'Pet was rescued from abuse or harmful conditions'),(32,2,'Pet is too young (puppy/kitten) to survive alone'),(33,2,'Pet was found in a public space where animals are not allowed'),(34,2,'Pet has been roaming for several days without supervision'),(35,2,'Pet finder cannot keep the pet at home'),(36,2,'Pet was found during a community event and needs safe holding'),(37,2,'Pet was surrendered voluntarily by someone unable to care for it');
/*!40000 ALTER TABLE `reason` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reunion`
--

DROP TABLE IF EXISTS `reunion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reunion` (
  `reunion_id` bigint NOT NULL AUTO_INCREMENT,
  `posted_at` date DEFAULT (curdate()),
  `title` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT 'N/A',
  `story` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT 'N/A',
  `image_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `hoid` bigint DEFAULT NULL,
  PRIMARY KEY (`reunion_id`),
  KEY `fk_37_reunion` (`hoid`),
  CONSTRAINT `fk_37_reunion` FOREIGN KEY (`hoid`) REFERENCES `hand_over` (`hoid`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reunion`
--

LOCK TABLES `reunion` WRITE;
/*!40000 ALTER TABLE `reunion` DISABLE KEYS */;
INSERT INTO `reunion` VALUES (1,'2026-10-24','Max is finally home','After 3 long days of searching, a kind neighbor found Max wandering near the local park. We are so incredibly grateful to the community for sharing the alert and bringing our boy back to us safely!','https://ik.imagekit.io/mangenatee/petRescue/petrescue-1792850936501-dog_nAXptW4Sc.jpeg',61);
/*!40000 ALTER TABLE `reunion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reunion_comment`
--

DROP TABLE IF EXISTS `reunion_comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reunion_comment` (
  `comment_id` bigint NOT NULL AUTO_INCREMENT,
  `reunion_id` bigint DEFAULT NULL,
  `commented_by_id` bigint DEFAULT NULL,
  `comment_posted` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT 'N/A',
  `posted_at` date DEFAULT (curdate()),
  PRIMARY KEY (`comment_id`),
  KEY `fk_38_reunion_comment` (`commented_by_id`),
  KEY `fk_39_reunion_comment` (`reunion_id`),
  CONSTRAINT `fk_38_reunion_comment` FOREIGN KEY (`commented_by_id`) REFERENCES `person` (`person_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_39_reunion_comment` FOREIGN KEY (`reunion_id`) REFERENCES `reunion` (`reunion_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reunion_comment`
--

LOCK TABLES `reunion_comment` WRITE;
/*!40000 ALTER TABLE `reunion_comment` DISABLE KEYS */;
INSERT INTO `reunion_comment` VALUES (1,1,1,'This is such wonderful news! So happy Max is safe.','2026-10-24'),(2,1,3,'amazing','2026-10-26'),(3,1,28,'great story','2026-10-27');
/*!40000 ALTER TABLE `reunion_comment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `status`
--

DROP TABLE IF EXISTS `status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `status` (
  `status_id` bigint NOT NULL AUTO_INCREMENT,
  `status_name` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`status_id`),
  UNIQUE KEY `uq_status_status_name` (`status_name`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `status`
--

LOCK TABLES `status` WRITE;
/*!40000 ALTER TABLE `status` DISABLE KEYS */;
INSERT INTO `status` VALUES (8,'Admitted'),(13,'Approved'),(4,'Awaiting Response'),(12,'Cancelled'),(7,'Closed'),(10,'Escalated'),(3,'In Progress'),(11,'On Hold'),(2,'Pending Verification'),(9,'Rejected'),(6,'Resolved'),(1,'Unresolved'),(5,'Verified');
/*!40000 ALTER TABLE `status` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `urgency_level`
--

DROP TABLE IF EXISTS `urgency_level`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `urgency_level` (
  `urgency_id` bigint NOT NULL AUTO_INCREMENT,
  `urgency_name` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `urgency_description` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`urgency_id`),
  UNIQUE KEY `uq_urgency_level_urgency_name` (`urgency_name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `urgency_level`
--

LOCK TABLES `urgency_level` WRITE;
/*!40000 ALTER TABLE `urgency_level` DISABLE KEYS */;
INSERT INTO `urgency_level` VALUES (1,'Low','Pet is missing but appears safe, seen in familiar or safe areas'),(2,'Medium','Pet has been missing for several days or found in uncertain conditions'),(3,'High','Pet is vulnerable due to injury, age, or unsafe environment'),(4,'Critical','Immediate intervention required due to severe danger or abuse');
/*!40000 ALTER TABLE `urgency_level` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wellbeing_description`
--

DROP TABLE IF EXISTS `wellbeing_description`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wellbeing_description` (
  `wellbeing_id` bigint NOT NULL AUTO_INCREMENT,
  `wellbeing_description` varchar(300) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`wellbeing_id`)
) ENGINE=InnoDB AUTO_INCREMENT=383 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wellbeing_description`
--

LOCK TABLES `wellbeing_description` WRITE;
/*!40000 ALTER TABLE `wellbeing_description` DISABLE KEYS */;
INSERT INTO `wellbeing_description` VALUES (1,'Healthy and energetic'),(2,'Calm and relaxed'),(3,'Playful and active'),(4,'Scared or anxious'),(5,'Aggressive or defensive'),(6,'Exhausted or weak'),(7,'Malnourished or starved'),(8,'Injured with visible wounds'),(9,'Sick or showing illness'),(10,'Recovering from illness or injury'),(11,'Friendly and approachable'),(12,'Fearful of strangers'),(13,'Lost but unharmed'),(14,'Found injured and distressed'),(15,'Found calm and cooperative'),(16,'Found exhausted and dehydrated'),(17,'Found malnourished and weak'),(18,'Found scared but safe'),(19,'Found aggressive and defensive'),(20,'Found playful and energetic'),(21,'Found sick and requiring medical care'),(22,'Found recovering and stable'),(261,NULL),(281,'Hungry and low on energy'),(282,'Slightly injured but healthy'),(302,'Her leg is injured'),(321,'Very tired'),(361,'Very scared and but friendly'),(381,'Weak in energy yet curious of surroundings'),(382,'Shy and persimistic');
/*!40000 ALTER TABLE `wellbeing_description` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-27 20:20:48

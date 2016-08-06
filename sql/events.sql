--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
CREATE TABLE IF NOT EXISTS `events` (
  `id` char(32) NOT NULL,
  `year` int(11) NOT NULL,
  `month` int(11) NOT NULL,
  `date` int(11) NOT NULL,
  `text` varchar(512) NOT NULL,
  `number` float NOT NULL,
  `flag` int(11) NOT NULL,
  `recurrence` int(11) NOT NULL,
  `tag` varchar(50) NOT NULL,
  `timestamp` bigint(20) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
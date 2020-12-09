<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

$config['forum_is_installed'] = 'y';
$config['index_page'] = 'index.php';
$config['is_system_on'] = 'y';
$config['multiple_sites_enabled'] = 'y';
$config['show_ee_news'] = 'n';
// ExpressionEngine Config Items
// Find more configs and overrides at
// https://docs.expressionengine.com/latest/general/system_configuration_overrides.html

$config['app_version'] = '5.4.0';
$config['encryption_key'] = '7d37828f483edf234986b751959b0323361f26e1';
$config['session_crypt_key'] = '0f89278163a298bed9d9298800dffcd36c6fa7fa';
$config['database'] = array(
	'expressionengine' => array(
		'hostname' => 'localhost',
		'database' => 'EE',
		'username' => 'ee',
		'password' => 'eepwd',
		'dbprefix' => 'exp_',
		'char_set' => 'utf8mb4',
		'dbcollat' => 'utf8mb4_unicode_ci',
		'port'     => ''
	),
);

// EOF
<?php
/**
 * Plugin Name.
 *
 * @package   TravellerPress
 * @author    Your Name <email@example.com>
 * @license   GPL-2.0+
 * @link      http://example.com
 * @copyright 2014 Your Name or Company Name
 */

/**
 * Plugin class. This class should ideally be used to work with the
 * public-facing side of the WordPress site.
 *
 * If you're interested in introducing administrative or dashboard
 * functionality, then refer to `class-plugin-name-admin.php`
 *
 * @TODO: Rename this class to a proper name for your plugin.
 *
 * @package TravellerPress
 * @author  Your Name <email@example.com>
 */
class TravellerPress {

	/**
	 * Plugin version, used for cache-busting of style and script file references.
	 *
	 * @since   1.0.0
	 *
	 * @var     string
	 */
	const VERSION = '1.0.0';

	/**
	 * @TODO - Rename "plugin-name" to the name of your plugin
	 *
	 * Unique identifier for your plugin.
	 *
	 *
	 * The variable name is used as the text domain when internationalizing strings
	 * of text. Its value should match the Text Domain file header in the main
	 * plugin file.
	 *
	 * @since    1.0.0
	 *
	 * @var      string
	 */
	protected $plugin_slug = 'travellerpress';

	/**
	 * Instance of this class.
	 *
	 * @since    1.0.0
	 *
	 * @var      object
	 */
	protected static $instance = null;

	/**
	 * Initialize the plugin by setting localization and loading public scripts
	 * and styles.
	 *
	 * @since     1.0.0
	 */
	private function __construct() {

		// Load plugin text domain
		add_action( 'init', array( $this, 'load_plugin_textdomain' ) );
		add_action( 'init', array( $this, 'register_taxonomies' ) );

		// Activate plugin when new blog is added
		add_action( 'wpmu_new_blog', array( $this, 'activate_new_site' ) );

		// Load public-facing style sheet and JavaScript.
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_styles' ) );
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_scripts' ) );

		// Allow uploading KML files
		add_filter("upload_mimes",array( $this,"add_upload_mimes" ) );

		add_shortcode( 'tp-global-map', array( $this, 'show_global_map' ) );
		add_shortcode( 'tp-single-map', array( $this, 'show_single_map' ) );
		add_shortcode( 'tp-custom-map', array( $this, 'show_custom_map' ) );
		
		add_action( 'init',  array( $this, 'infobox_image_size' ) );

	}

	/**
	 * Return the plugin slug.
	 *
	 * @since    1.0.0
	 *
	 * @return    Plugin slug variable.
	 */
	public function get_plugin_slug() {
		return $this->plugin_slug;
	}

	/**
	 * Return an instance of this class.
	 *
	 * @since     1.0.0
	 *
	 * @return    object    A single instance of this class.
	 */
	public static function get_instance() {

		// If the single instance hasn't been set, set it now.
		if ( null == self::$instance ) {
			self::$instance = new self;
		}

		return self::$instance;
	}

	/**
	 * Fired when the plugin is activated.
	 *
	 * @since    1.0.0
	 *
	 * @param    boolean    $network_wide    True if WPMU superadmin uses
	 *                                       "Network Activate" action, false if
	 *                                       WPMU is disabled or plugin is
	 *                                       activated on an individual blog.
	 */
	public static function activate( $network_wide ) {

		if ( function_exists( 'is_multisite' ) && is_multisite() ) {

			if ( $network_wide  ) {

				// Get all blog ids
				$blog_ids = self::get_blog_ids();

				foreach ( $blog_ids as $blog_id ) {

					switch_to_blog( $blog_id );
					self::single_activate();
				}

				restore_current_blog();

			} else {
				self::single_activate();
			}

		} else {
			self::single_activate();
		}

	}

	/**
	 * Fired when the plugin is deactivated.
	 *
	 * @since    1.0.0
	 *
	 * @param    boolean    $network_wide    True if WPMU superadmin uses
	 *                                       "Network Deactivate" action, false if
	 *                                       WPMU is disabled or plugin is
	 *                                       deactivated on an individual blog.
	 */
	public static function deactivate( $network_wide ) {

		if ( function_exists( 'is_multisite' ) && is_multisite() ) {

			if ( $network_wide ) {

				// Get all blog ids
				$blog_ids = self::get_blog_ids();

				foreach ( $blog_ids as $blog_id ) {

					switch_to_blog( $blog_id );
					self::single_deactivate();

				}

				restore_current_blog();

			} else {
				self::single_deactivate();
			}

		} else {
			self::single_deactivate();
		}

	}

	/**
	 * Fired when a new site is activated with a WPMU environment.
	 *
	 * @since    1.0.0
	 *
	 * @param    int    $blog_id    ID of the new blog.
	 */
	public function activate_new_site( $blog_id ) {

		if ( 1 !== did_action( 'wpmu_new_blog' ) ) {
			return;
		}

		switch_to_blog( $blog_id );
		self::single_activate();
		restore_current_blog();

	}

	/**
	 * Get all blog ids of blogs in the current network that are:
	 * - not archived
	 * - not spam
	 * - not deleted
	 *
	 * @since    1.0.0
	 *
	 * @return   array|false    The blog ids, false if no matches.
	 */
	private static function get_blog_ids() {

		$sites = wp_get_sites();
		$blog_ids = array();
		foreach ( $sites as $site ) {
			$blog_ids[] = $site['blog_id'];
		}
		return $blog_ids;
	}

	/**
	 * Fired for each blog when the plugin is activated.
	 *
	 * @since    1.0.0
	 */
	private static function single_activate() {
		// @TODO: Define activation functionality here
	}

	/**
	 * Fired for each blog when the plugin is deactivated.
	 *
	 * @since    1.0.0
	 */
	private static function single_deactivate() {
		// @TODO: Define deactivation functionality here
	}

	/**
	 * Load the plugin text domain for translation.
	 *
	 * @since    1.0.0
	 */
	public function load_plugin_textdomain() {

		$domain = $this->plugin_slug;
		$locale = apply_filters( 'plugin_locale', get_locale(), $domain );

		load_textdomain( $domain, trailingslashit( WP_LANG_DIR ) . $domain . '/' . $domain . '-' . $locale . '.mo' );
		load_plugin_textdomain( $domain, FALSE, basename( plugin_dir_path( dirname( __FILE__ ) ) ) . '/languages/' );

	}


	/**
	 * Allow uploading kml and kmz files to WordPress
	 *
	 * @since    1.0.0
	 */
	public function add_upload_mimes($mimes=array()) {
	    $mimes['kml'] = 'application/vnd.google-earth.kml+xml';
	    $mimes['kmz'] = 'application/vnd.google-earth.kmz';
	    $mimes['svg'] = 'image/svg+xml';
	    return $mimes;
	}

	/**
	 * Register and enqueue public-facing style sheet.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles() {
		wp_enqueue_style( $this->plugin_slug . '-plugin-styles', plugins_url( 'assets/css/public.css', __FILE__ ), array(), self::VERSION );
		$general_settings = get_option( 'travellerpress_general_settings' );
		$size = (isset($general_settings['map_height'])) ? $general_settings['map_height'] : '500px' ;
        $custom_css = "
	               .custom_map, 
	               body #map-container #map_elements, 
	               body #map-container #map { height: {$size}; }
	               body .alternative #map-container, body .alternative#map-container  { height: {$size}; }
					@media only screen and (min-width: 960px) and (max-width: 1469px) {
						body #map-container { height: {$size}; }
					}
               ";
        wp_add_inline_style(  $this->plugin_slug . '-plugin-styles', $custom_css );
	}

	/**
	 * Register and enqueues public-facing JavaScript files.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {
		global $post;
		$general_settings = get_option( 'travellerpress_general_settings' );
		
		wp_register_script( $this->plugin_slug . '-markerclusterer', plugins_url( 'assets/js/markerclusterer.min.js', __FILE__ ), array( 'jquery' ), self::VERSION, true );
		wp_register_script( $this->plugin_slug . '-global-map', plugins_url( 'assets/js/global_map.js', __FILE__ ), array( 'jquery' ), self::VERSION, true );
		wp_register_script( $this->plugin_slug . '-single-map', plugins_url( 'assets/js/single_map.js', __FILE__ ), array( 'jquery' ), self::VERSION, true );
		wp_register_script( $this->plugin_slug . '-custom-map', plugins_url( 'assets/js/custom_map.js', __FILE__ ), array( 'jquery' ), self::VERSION, true );

		if(isset($general_settings['api'])) {
			$apikey = preg_replace('/\s+/', '', $general_settings['api']);
			wp_register_script(
				'leaflet-maps-js-api',
				'https://unpkg.com/leaflet@1.6.0/dist/leaflet.js',
				array(),
				null
			);
		}
		wp_enqueue_script( $this->plugin_slug . '-plugin-script', plugins_url( 'assets/js/public.js', __FILE__ ), array( 'jquery' ), self::VERSION );
		if(is_singular()) {
			$ids = $this->find_map_shortcode_get_all_attributes('tp-custom-map',$post->post_content);
			if(!empty($ids)) {
				$sh_ids = array();
					foreach ($ids as $id) {
					$sh_ids[]= 'custommap'.$id;
				}
				wp_localize_script( $this->plugin_slug . '-plugin-script', 'custom_map_ids', $sh_ids );
			}
		}
		if ( is_singular( 'tp_maps' ) ) {

		    wp_localize_script( $this->plugin_slug . '-plugin-script', 'custom_map_ids', array('custommap'.$post->ID) );
		}
		
		if(isset($general_settings['scale'])) {
			$scale = $general_settings['scale'];
		} else {
			$scale = '1.1';
		}	

		wp_localize_script( $this->plugin_slug . '-plugin-script', 'travellerpress_general_settings',  
			array( 
				'scale'	 			=> $scale,
				'group_text' 		=> esc_html__('Post Series:','travellerpress'),
				'infobox_width' 	=> (isset($general_settings['infobox_width'])) ? $general_settings['infobox_width'] : 300,
				'wpv_url'			=> plugins_url('assets',__FILE__),
				'clusters_status'	=> (isset($general_settings['clusters_status'])) ? $general_settings['clusters_status'] : false,
				'max_cluster_zoom'	=> (isset($general_settings['max_cluster_zoom'])) ? $general_settings['max_cluster_zoom'] : '19',
				'min_cluster_size'	=> (isset($general_settings['min_cluster_size'])) ? $general_settings['min_cluster_size'] : '2',
				) );
	}


	

	public function register_taxonomies() {

		$labels = array(
			'name'                => _x( 'Custom Maps', 'Post Type General Name', 'travellerpress' ),
			'singular_name'       => _x( 'Custom Map', 'Post Type Singular Name', 'travellerpress' ),
			'menu_name'           => __( 'Custom Maps', 'travellerpress' ),
			'name_admin_bar'      => __( 'Custom Map', 'travellerpress' ),
			'parent_item_colon'   => __( 'Parent Map:', 'travellerpress' ),
			'all_items'           => __( 'All Maps', 'travellerpress' ),
			'add_new_item'        => __( 'Add New Map', 'travellerpress' ),
			'add_new'             => __( 'Add New', 'travellerpress' ),
			'new_item'            => __( 'New Map', 'travellerpress' ),
			'edit_item'           => __( 'Edit Map', 'travellerpress' ),
			'update_item'         => __( 'Update Map', 'travellerpress' ),
			'view_item'           => __( 'View Map', 'travellerpress' ),
			'search_items'        => __( 'Search Map', 'travellerpress' ),
			'not_found'           => __( 'Not found', 'travellerpress' ),
			'not_found_in_trash'  => __( 'Not found in Trash', 'travellerpress' ),
		);
		$args = array(
			'label'               => __( 'tp_maps', 'travellerpress' ),
			'description'         => __( 'Custom Maps that can be inserted in posts and pages', 'travellerpress' ),
			'labels'              => $labels,
			'supports'            => array( 'title', 'custom-fields', ),
			'hierarchical'        => false,
			'public'              => true,
			'show_ui'             => true,
			'show_in_menu'        => true,
			'menu_position'       => 10,
			'menu_icon'           => 'dashicons-admin-site',
			'show_in_admin_bar'   => false,
			'show_in_nav_menus'   => false,
			'can_export'          => true,
			'has_archive'         => true,		
			'exclude_from_search' => true,
			'publicly_queryable'  => true,
			'capability_type'     => 'page',
		);
		register_post_type( 'tp_maps', $args );


	}


	private function string_limit_words($string, $word_limit) {
	    $words = explode(' ', $string, ($word_limit + 1));
	    if (count($words) > $word_limit) {
	        array_pop($words);
	        //add a ... at last article when more than limit word count
	        return implode(' ', $words) ;
	    } else {
	        //otherwise
	        return implode(' ', $words);
	    }
	}


	private function find_matching_location($haystack, $needle) {

	    foreach ($haystack as $index => $a) {

	        if ($a['lat'] == $needle['lat']
	                && $a['lng'] == $needle['lng']
	              ) {
	            return $index;
	        }
	    }
	    return null;
	}


	public function show_global_map($atts){
		extract(shortcode_atts(array(
			'class' => '',
			'category' => '',
			'tag' => '',
			'postseries' => '',
			), $atts));

	
		$args = array( 
			'posts_per_page' => -1,
			'category__in' => $category,
			'tag__in' => $tag
			);
		if(!empty($postseries)){
			$args['tax_query'] = array(
                array(
                    'posts_per_page' => 1,
                    'taxonomy' => 'post_series',
                    'field' => 'slug',
                    'terms' => array ($postseries)
                )
            );
		}
		$the_query = new WP_Query( $args );
		$markers = array();
		// The Loop
		if ( $the_query->have_posts() ) {
			$i = 0;
			while ( $the_query->have_posts() ) {
				$the_query->the_post();
				$lat = get_post_meta($the_query->post->ID, 'main_point_latitude',true);
				if (!empty($lat)) {
				    
					$ibcontet = '';
					$point_image_id = get_post_meta($the_query->post->ID, 'main_point_image',true);
					
					if(!empty($point_image_id)) {
						$point_image_src = wp_get_attachment_image_src( $point_image_id, 'travellerpress' );	
					} else {
						$point_image_src = wp_get_attachment_image_src(  get_post_thumbnail_id(), 'travellerpress' );
					}

					if($point_image_src){
						$ibcontet .= '<a href="'.esc_url(get_permalink()).'" class="map-box-image"><img src="'.esc_url($point_image_src[0]).'" alt=""/><i class="map-box-icon"></i></a>';
					}

					$marker_title = get_post_meta($the_query->post->ID, 'main_point_title',true);
					if(empty($marker_title)) {
						$title = get_the_title();
					} else {
						$title = $marker_title;
					}

					$marker_content = get_post_meta($the_query->post->ID, 'main_point_text',true);
					if(empty($marker_content)) {
						$content = get_the_excerpt();
						$content = $this->string_limit_words($content, 16);
					} else {
						$content = $marker_content;
					}

					$time_string = '<span class="date"><time class="entry-date published updated" datetime="%1$s">%2$s</time></span>';

					$time_string = sprintf( $time_string,
						esc_attr( get_the_date( 'c' ) ),
						esc_html( get_the_date() ),
						esc_attr( get_the_modified_date( 'c' ) ),
						esc_html( get_the_modified_date() )
					);
					
					$ibdata = $ibcontet.'<a href="'.esc_url(get_permalink()).'"><h2>'.$title.'</h2></a>'.$time_string.'<p>'.$content.'</p><div class="infoBox-close"><i class="fa fa-times"></i></div>';
					$ibmergecontent = '<li><a href="'.esc_url(get_permalink()).'">'.$title.'</a></li>';
					$mappoint = array(
						'address' =>  get_post_meta($the_query->post->ID , 'main_point_longitude',true),
						'lat' =>  $lat,
						'lng' =>  get_post_meta($the_query->post->ID, 'main_point_longitude',true),
						'color' =>  get_post_meta($the_query->post->ID, 'main_point_color', true),
						'icon_image' =>  get_post_meta($the_query->post->ID, 'main_point_icon_image', true),
						'id' => $i,
						'ibcontent' => $ibdata,
						'ibmergecontent' => $ibmergecontent,
						'ismerged' => 'no'
					);
					

					// check if such element exists in the array
					$matching_index = $this->find_matching_location($markers, $mappoint);
					if ($matching_index !== null) { // if it exists then change pointdata
					    $markers[$matching_index]['ibmergecontent'] = $markers[$matching_index]['ibmergecontent'] . $mappoint['ibmergecontent'];
					    $markers[$matching_index]['ismerged'] = "yes";
					} else { // otherwise add it to main array
					    $markers[] = $mappoint;
					    $i++;
					}
					
				}
				//$markers[] = $mappoint;
			}
		}

		wp_reset_postdata();

		$meta_maps_points = array();
		$meta_maps_points_temp = get_option( 'tp_global_mappoints_value' );
		if(!empty($meta_maps_points_temp)){
			foreach ($meta_maps_points_temp as $point) {
				$ibcontet = '';
				if($point['image']){
						$point_image_src = wp_get_attachment_image_src( $point['image'], 'travellerpress' );	
						$ibcontet .= '<a href="#" class="map-box-image"><img src="'.$point_image_src[0].'" alt=""/><i class="map-box-icon"></i></a>';
				}
				if(empty($point['pointtitle'])) { $title = $point['pointaddress']; } else {	$title = $point['pointtitle'];	}
				if(empty($point['pointdata'])) { $content = "";	} else { $content = $point['pointdata']; }
				if(empty($point['pointurl'])) { $url = "#";	} else { $url = $point['pointurl']; }

				$ibdata = $ibcontet.'<a href="'.esc_url($url).'"><h2>'.$title.'</h2></a><p>'.$content.'</p><div class="infoBox-close"><i class="fa fa-times"></i></div>';


				$mappoint = array(
						'address' =>  $point['pointaddress'],
						'lat' =>  $point['pointlat'],
						'lng' =>  $point['pointlong'],
						'color' =>  $point['icon'],
						'icon_image' =>  $point['pointicon_image'],
						'id' => $i,
						'ibcontent' => $ibdata,
						'ibmergecontent' => '',
						'ismerged' => 'no'
				);

				$i++;	
				$markers[] = $mappoint;  		
			}
		}


		$meta_maps_polygons = array();
		$meta_maps_polygons_temp = get_option( 'tp_global_mappolygons_value' );
		if(!empty($meta_maps_polygons_temp)){
			foreach ($meta_maps_polygons_temp as $polygon) {
				$ibcontet = '';
				$polygon_image_id = $polygon['image'];
				
				if(!empty($polygon_image_id)) {
					$polygon_image_src = wp_get_attachment_image_src( $polygon_image_id, 'travellerpress' );	
					$ibcontet .= '<img src="'.$polygon_image_src[0].'" alt=""/><i class="map-box-icon"></i>';
				} 
				if(empty($polygon['title'])) { $title = ''; } else { $title = $polygon['title'];	}
				if(empty($polygon['data'])) { $content = "";	} else { $content = $polygon['data']; }

				$ibdata = $ibcontet.'<h2>'.$title.'</h2><p>'.$content.'</p><div class="infoBox-close"><i class="fa fa-times"></i></div>';
				$polygon['ibdata'] = $ibdata;
				
				$meta_maps_polygons[] = $polygon; 
			}
		}

		$meta_maps_polylines = array();
		$meta_maps_polylines_temp = get_option( 'tp_global_mappolylines_value' );
		if(!empty($meta_maps_polylines_temp)){
			foreach ($meta_maps_polylines_temp as $polyline) {
				
				$ibcontet = '';
				$polyline_image_id = $polyline['image'];
				
				if(!empty($polyline_image_id)) {
					$polyline_image_src = wp_get_attachment_image_src( $polyline_image_id, 'travellerpress' );	
					$ibcontet .= '<img src="'.$polyline_image_src[0].'" alt=""/><i class="map-box-icon"></i>';
				} 
				if(empty($polyline['title'])) { $title = ''; } else { $title = $polyline['title'];	}
				if(empty($polyline['data'])) { $content = "";	} else { $content = $polyline['data']; }

				$ibdata = $ibcontet.'<h2>'.$title.'</h2><p>'.$content.'</p><div class="infoBox-close"><i class="fa fa-times"></i></div>';
				$polyline['ibdata'] = $ibdata;
				
				$meta_maps_polylines[] = $polyline; 
			}	
		}	

		$meta_maps_kml =get_option('tp_global_mapkml_value'); 
		
		$elements = array(
			'polylines' => $meta_maps_polylines,
			'polygons' => $meta_maps_polygons,
			'kml' => $meta_maps_kml,

		);
		wp_enqueue_script( 'leaflet-maps-js-api' );
		wp_enqueue_script( $this->plugin_slug . '-markerclusterer' );

		wp_enqueue_script( $this->plugin_slug . '-global-map' );
		wp_localize_script( $this->plugin_slug . '-global-map', 'globalmap', $markers );
		wp_localize_script( $this->plugin_slug . '-global-map', 'globalmap_elements', $elements );
		$mapoptions = get_option( 'travellerpress_globalMapSettings' );
		if( is_category() || is_tag() || is_tax('post_series') ){
			$automarker =  get_term_meta( get_queried_object_id(), 'travelmatic_map_auto_open', TRUE);
			if(!isset($automarker)) { $automarker = $mapoptions['map_auto_open']; }
			$centerPoint = get_term_meta( get_queried_object_id(), 'travelmatic_map_custom_center_open', TRUE);
			if(empty($centerPoint)){
				$centerPoint = (isset($mapoptions['map_custom_center_open'])) ? $mapoptions['map_custom_center_open'] : "";	
			}
		} else {
			$automarker = (isset($mapoptions['map_auto_open'])) ? $mapoptions['map_auto_open'] : 1;
			$centerPoint = (isset($mapoptions['map_custom_center_open'])) ? $mapoptions['map_custom_center_open'] : "";
		}
		
		wp_localize_script( $this->plugin_slug . '-global-map', 'travellerpress_settings',
			    array(
			        'automarker'=> (isset($automarker)) ? $automarker : 1,
			        'centerPoint' => (isset($centerPoint)) ? $centerPoint : "",
			        )
			    );
		$output = '';
		$output .= '<div id="map-container" class="'.esc_attr($class).'">';
		$output .= '<div id="map">
		        <!-- map goes here -->
		    </div>
		</div>';

		return $output;
		;
	}

	public function show_single_map($atts){
		extract(shortcode_atts(array(
			'id' => '',
			'class' => '',
			), $atts));
		global $post;

		$meta_maps_point = array();
		$meta_maps_point_temp = get_post_meta($post->ID, 'mappoints_value', true);

		foreach ($meta_maps_point_temp as $point) {
				
				$ibcontet = '';
				$point_image_id = $point['image'];
				
				if(!empty($point_image_id)) {
					$point_image_src = wp_get_attachment_image_src( $point_image_id, 'travellerpress' );	
					$ibcontet .= '<img src="'.esc_url($point_image_src[0]).'" alt=""/><i class="map-box-icon"></i>';
				} 
				if(empty($point['pointtitle'])) { $title = $point['pointaddress']; } else {	$title = $point['pointtitle'];	}
				if(empty($point['pointdata'])) { $content = "";	} else { $content = $point['pointdata']; }
				
				if(empty($point['pointurl'])){
                    $ibdata = $ibcontet.'<h2>'.$title.'</h2><p>'.$content.'</p><div class="infoBox-close"><i class="fa fa-times"></i></div>';
                } else {
                    $ibdata = $ibcontet.'<h2><a href="'.$point['pointurl'].'">'.$title.'</a></h2><p>'.$content.'</p><div class="infoBox-close"><i class="fa fa-times"></i></div>';
                }
				
				$point['ibdata'] = $ibdata;
				
				$meta_maps_point[] = $point; 
		}

		$meta_maps_polygons = array();
		$meta_maps_polygons_temp = get_post_meta($post->ID, 'mappolygons_value', true);
		foreach ($meta_maps_polygons_temp as $polygon) {
				
				$ibcontet = '';
				$polygon_image_id = $polygon['image'];
				
				if(!empty($polygon_image_id)) {
					$polygon_image_src = wp_get_attachment_image_src( $polygon_image_id, 'travellerpress' );	
					$ibcontet .= '<img src="'.esc_url($polygon_image_src[0]).'" alt=""/><i class="map-box-icon"></i>';
				} 
				if(empty($polygon['title'])) { $title = ''; } else { $title = $polygon['title'];	}
				if(empty($polygon['data'])) { $content = "";	} else { $content = $polygon['data']; }

				if(empty($ibcontet) && empty($title) && empty($content)){
					$ibdata = "";
				} else {
					if(empty($polygon['pointurl'])){
	                    $ibdata = $ibcontet.'<h2>'.$title.'</h2><p>'.$content.'</p><div class="infoBox-close"><i class="fa fa-times"></i></div>';
	                } else {
	                    $ibdata = $ibcontet.'<h2><a href="'.$polygon['pointurl'].'">'.$title.'</a></h2><p>'.$content.'</p><div class="infoBox-close"><i class="fa fa-times"></i></div>';
	                }
				}
				$polygon['ibdata'] = $ibdata;
				
				$meta_maps_polygons[] = $polygon; 
		}

		$meta_maps_polylines = array();
		$meta_maps_polylines_temp = get_post_meta($post->ID, 'mappolylines_value', true);
		foreach ($meta_maps_polylines_temp as $polyline) {
				
				$ibcontet = '';
				$polyline_image_id = $polyline['image'];
				
				if(!empty($polyline_image_id)) {
					$polyline_image_src = wp_get_attachment_image_src( $polyline_image_id, 'travellerpress' );	
					$ibcontet .= '<img src="'.$polyline_image_src[0].'" alt=""/><i class="map-box-icon"></i>';
				} 
				if(empty($polyline['title'])) { $title = ''; } else { $title = $polyline['title'];	}
				if(empty($polyline['data'])) { $content = "";	} else { $content = $polyline['data']; }

				$ibdata = $ibcontet.'<h2>'.$title.'</h2><p>'.$content.'</p><div class="infoBox-close"><i class="fa fa-times"></i></div>';
				if(empty($ibcontet) && empty($title) && empty($content)){
					$ibdata = "";
				} else {
					if(empty($polyline['pointurl'])){
	                    $ibdata = $ibcontet.'<h2>'.$title.'</h2><p>'.$content.'</p><div class="infoBox-close"><i class="fa fa-times"></i></div>';
	                } else {
	                    $ibdata = $ibcontet.'<h2><a href="'.$polyline['pointurl'].'">'.$title.'</a></h2><p>'.$content.'</p><div class="infoBox-close"><i class="fa fa-times"></i></div>';
	                }
				}
				$polyline['ibdata'] = $ibdata;
				
				$meta_maps_polylines[] = $polyline; 
		}


		$meta_maps_kml = get_post_meta($post->ID, 'mapkml_value', true);

		$map_el_style = get_post_meta($post->ID, 'map_el_style', true); 
		$styles = get_option( 'travellerpress_settings' );
		
		if( $map_el_style != "default" ) { $mapstyle = $styles[$map_el_style]; } else { $mapstyle = '';}

		$map_el_zoom = get_post_meta($post->ID, 'map_el_zoom', true);
		$map_auto_open = get_post_meta($post->ID, 'map_auto_open', true);
		$map_el_type = get_post_meta($post->ID, 'map_el_type', true);
		$map_custom_center_open = get_post_meta($post->ID, 'map_custom_center_open', true);

		if(empty($meta_maps_point_temp) && empty($meta_maps_polylines_temp) && empty($meta_maps_polylines) && empty($meta_maps_kml)){
			$lat = get_post_meta($post->ID, 'main_point_latitude',true);
			if (!empty($lat)) {
				$ibcontet = '';
				$point_image_id = get_post_meta($post->ID, 'main_point_image',true);
				
				if(!empty($point_image_id)) {
					$point_image_src = wp_get_attachment_image_src( $point_image_id, 'travellerpress' );	
				} else {
					$point_image_src = wp_get_attachment_image_src(  get_post_thumbnail_id(), 'travellerpress' );
				}

				if($point_image_src){
					$ibcontet .= '<a href="'.get_permalink().'" class="map-box-image"><img src="'.$point_image_src[0].'" alt=""/><i class="map-box-icon"></i></a>';
				}

				$marker_title = get_post_meta($post->ID, 'main_point_title',true);
				if(empty($marker_title)) {
					$title = get_the_title();
				} else {
					$title = $marker_title;
				}

				$marker_content = get_post_meta($post->ID, 'main_point_text',true);
				if(empty($marker_content)) {
					$content = get_the_excerpt();
					$content = $this->string_limit_words($content, 16);
				} else {
					$content = $marker_content;
				}

				$time_string = '<span class="date"><time class="entry-date published updated" datetime="%1$s">%2$s</time></span>';

				$time_string = sprintf( $time_string,
					esc_attr( get_the_date( 'c' ) ),
					esc_html( get_the_date() ),
					esc_attr( get_the_modified_date( 'c' ) ),
					esc_html( get_the_modified_date() )
				);
				
				$ibdata = $ibcontet.'<a href="'.get_permalink().'"><h2>'.$title.'</h2></a>'.$time_string.'<p>'.$content.'</p><div class="infoBox-close"><i class="fa fa-times"></i></div>';
				$mappoint = array(
					'pointaddress' =>  get_post_meta($post->ID , 'main_point_longitude',true),
					'pointlat' =>  $lat,
					'pointlong' =>  get_post_meta($post->ID, 'main_point_longitude',true),
					'icon' =>  get_post_meta($post->ID, 'main_point_color', true),
					'id' => 0,
					'ibdata' => $ibdata
				);
				
				$meta_maps_point[] = $mappoint;
			}
			$elements = array(
				'locations' => $meta_maps_point,
				'polygons' => $meta_maps_polygons,
				'polylines' => $meta_maps_polylines,
				'kml' => $meta_maps_kml,
				'map_el_type' => $map_el_type,
				'map_el_zoom' => $map_el_zoom,
				'map_el_style' => $mapstyle,
				'map_auto_open' => $map_auto_open,
				'centerPoint' => $map_custom_center_open,
			);
		} else {
			$elements = array(
				'locations' => $meta_maps_point,
				'polygons' => $meta_maps_polygons,
				'polylines' => $meta_maps_polylines,
				'kml' => $meta_maps_kml,
				'map_el_type' => $map_el_type,
				'map_el_zoom' => $map_el_zoom,
				'map_el_style' => $mapstyle,
				'map_auto_open' => $map_auto_open,
				'centerPoint' => $map_custom_center_open,
			);
		}

		wp_enqueue_script( 'leaflet-maps-js-api' );
		wp_enqueue_script( $this->plugin_slug . '-markerclusterer' );
		wp_enqueue_script( $this->plugin_slug . '-single-map' );
		wp_localize_script( $this->plugin_slug . '-single-map', 'singlemap', $elements );

		return '
		<div id="map-container" class="'.esc_attr($class).'">
		    <div id="map_elements">
		        <!-- map goes here -->
		    </div>
		</div>';
	}

	public function find_map_shortcode_get_all_attributes( $tag, $text )
	{
	    //preg_match_all( '/' . get_shortcode_regex() . '/s', $text, $matches );
	    $out = array();
	    preg_match_all("/\[tp-custom-map id=\"(.*?)\"/",$text,$matches);
	    //echo "<pre>"; print_r($matches[1]); echo "</pre>";  die();
	    if( isset( $matches[1] ) )
	    {
	        foreach( (array) $matches[1] as $key => $value )
	        {
	            
	                $out[] = $value;  
	        }
	    }

	    return $out;
	}


	public function show_custom_map($atts){
		extract(shortcode_atts(array(
			'id' => '',
			'width' => '200px',
			'height' => '200px',
			'class' => '',
			'type' => '',
			), $atts));
		global $post;

		$meta_maps_point = array();
		$meta_maps_point_temp = get_post_meta($id, 'mappoints_value', true);
		if(!empty($meta_maps_point_temp)){
			foreach ($meta_maps_point_temp as $point) {
					
					$ibcontet = '';
					$point_image_id = $point['image'];
					
					if(!empty($point_image_id)) {
						$point_image_src = wp_get_attachment_image_src( $point_image_id, 'travellerpress' );	
						$ibcontet .= '<img src="'.esc_url($point_image_src[0]).'" alt=""/><i class="map-box-icon"></i>';
					} 
					if(empty($point['pointtitle'])) { $title = $point['pointaddress']; } else {	$title = $point['pointtitle'];	}
					if(empty($point['pointdata'])) { $content = "";	} else { $content = $point['pointdata']; }
					if(empty($point['pointurl'])) { $url = "#";	} else { $url = $point['pointurl']; }
					$ibdata = $ibcontet.'<a href="'.esc_url($url).'"><h2>'.$title.'</h2></a><p>'.$content.'</p><div class="infoBox-close"><i class="fa fa-times"></i></div>';
					$point['ibdata'] = $ibdata;
					
					$meta_maps_point[] = $point; 
			}
		}
		$meta_maps_polygons = array();
		$meta_maps_polygons_temp = get_post_meta($id, 'mappolygons_value', true);
		if(!empty($meta_maps_polygons_temp)){
			foreach ($meta_maps_polygons_temp as $polygon) {
					
					$ibcontet = '';
					$polygon_image_id = $polygon['image'];
					
					if(!empty($polygon_image_id)) {
						$polygon_image_src = wp_get_attachment_image_src( $polygon_image_id, 'travellerpress' );	
						$ibcontet .= '<img src="'.esc_url($polygon_image_src[0]).'" alt=""/><i class="map-box-icon"></i>';
					} 
					if(empty($polygon['title'])) { $title = ''; } else { $title = $polygon['title'];	}
					if(empty($polygon['data'])) { $content = "";	} else { $content = $polygon['data']; }
					if(empty($polygon['pointurl'])) { $url = "#";	} else { $url = $polygon['pointurl']; }
					if(empty($ibcontet) && empty($title) && empty($content)){
						$ibdata = "";
					} else {
						$ibdata = $ibcontet.'<a href="'.esc_url($url).'"><h2>'.$title.'</h2></a><p>'.$content.'</p><div class="infoBox-close"><i class="fa fa-times"></i></div>';
					}
					$polygon['ibdata'] = $ibdata;
					
					$meta_maps_polygons[] = $polygon; 
			}
		}

		$meta_maps_polylines = array();
		$meta_maps_polylines_temp = get_post_meta($id, 'mappolylines_value', true);
		if(!empty($meta_maps_polylines_temp)){
			foreach ($meta_maps_polylines_temp as $polyline) {
					
					$ibcontet = '';
					$polyline_image_id = $polyline['image'];
					
					if(!empty($polyline_image_id)) {
						$polyline_image_src = wp_get_attachment_image_src( $polyline_image_id, 'travellerpress' );	
						$ibcontet .= '<img src="'.$polyline_image_src[0].'" alt=""/><i class="map-box-icon"></i>';
					} 
					if(empty($polyline['title'])) { $title = ''; } else { $title = $polyline['title'];	}
					if(empty($polyline['data'])) { $content = "";	} else { $content = $polyline['data']; }
					if(empty($polyline['pointurl'])) { $url = "#";	} else { $url = $polyline['pointurl']; }
					$ibdata = $ibcontet.'<h2>'.$title.'</h2><p>'.$content.'</p><div class="infoBox-close"><i class="fa fa-times"></i></div>';
					if(empty($ibcontet) && empty($title) && empty($content)){
						$ibdata = "";
					} else {
						$ibdata = $ibcontet.'<a href="'.esc_url($url).'"><h2>'.$title.'</h2></a><p>'.$content.'</p><div class="infoBox-close"><i class="fa fa-times"></i></div>';
					}
					$polyline['ibdata'] = $ibdata;
					
					$meta_maps_polylines[] = $polyline; 
			}
		}

		$meta_maps_kml = get_post_meta($id, 'mapkml_value', true);

		$map_el_style = get_post_meta($id, 'map_el_style', true); 
		$styles = get_option( 'travellerpress_settings' );
		
		if( $map_el_style != "default" ) { $mapstyle = $styles[$map_el_style]; } else { $mapstyle = '';}

		$map_el_zoom = get_post_meta($id, 'map_el_zoom', true);
		$map_auto_open = get_post_meta($id, 'map_auto_open', true);
		$map_el_type = get_post_meta($id, 'map_el_type', true);
		$map_custom_center_open = get_post_meta($id, 'map_custom_center_open', true);

		if(empty($meta_maps_point_temp) && empty($meta_maps_polylines_temp) && empty($meta_maps_polylines) && empty($meta_maps_kml)){
			$lat = get_post_meta($id, 'main_point_latitude',true);
			if (!empty($lat)) {
				$ibcontet = '';
				$point_image_id = get_post_meta($id, 'main_point_image',true);
				
				if(!empty($point_image_id)) {
					$point_image_src = wp_get_attachment_image_src( $point_image_id, 'travellerpress' );	
				} else {
					$point_image_src = wp_get_attachment_image_src(  get_post_thumbnail_id(), 'travellerpress' );
				}

				if($point_image_src){
					$ibcontet .= '<a href="'.get_permalink().'" class="map-box-image"><img src="'.$point_image_src[0].'" alt=""/><i class="map-box-icon"></i></a>';
				}

				$marker_title = get_post_meta($id, 'main_point_title',true);
				if(empty($marker_title)) {
					$title = get_the_title();
				} else {
					$title = $marker_title;
				}

				$marker_content = get_post_meta($id, 'main_point_text',true);
				if(empty($marker_content)) {
					$content = get_the_excerpt();
					$content = $this->string_limit_words($content, 16);
				} else {
					$content = $marker_content;
				}

				$time_string = '<span class="date"><time class="entry-date published updated" datetime="%1$s">%2$s</time></span>';

				$time_string = sprintf( $time_string,
					esc_attr( get_the_date( 'c' ) ),
					esc_html( get_the_date() ),
					esc_attr( get_the_modified_date( 'c' ) ),
					esc_html( get_the_modified_date() )
				);
				
				$ibdata = $ibcontet.'<a href="'.get_permalink().'"><h2>'.$title.'</h2></a>'.$time_string.'<p>'.$content.'</p><div class="infoBox-close"><i class="fa fa-times"></i></div>';
				$mappoint = array(
					'pointaddress' =>  get_post_meta($id , 'main_point_longitude',true),
					'pointlat' =>  $lat,
					'pointlong' =>  get_post_meta($id, 'main_point_longitude',true),
					'icon' =>  get_post_meta($id, 'main_point_color', true),
					'id' => 0,
					'ibdata' => $ibdata
				);
				
				$meta_maps_point[] = $mappoint;
			}
			$elements = array(
				'id' => esc_attr($id),
				'locations' => $meta_maps_point,
				'polygons' => $meta_maps_polygons,
				'polylines' => $meta_maps_polylines,
				'kml' => $meta_maps_kml,
				'map_el_type' => $map_el_type,
				'map_el_zoom' => $map_el_zoom,
				'map_el_style' => $mapstyle,
				'map_auto_open' => $map_auto_open,
				'centerPoint' => $map_custom_center_open,
			);
		} else {
			$elements = array(
				'id' => esc_attr($id),
				'locations' => $meta_maps_point,
				'polygons' => $meta_maps_polygons,
				'polylines' => $meta_maps_polylines,
				'kml' => $meta_maps_kml,
				'map_el_type' => $map_el_type,
				'map_el_zoom' => $map_el_zoom,
				'map_el_style' => $mapstyle,
				'map_auto_open' => $map_auto_open,
				'centerPoint' => $map_custom_center_open,
			);
		}

		
		if($type == "as_global") {
			wp_enqueue_script( 'leaflet-maps-js-api' );
			wp_enqueue_script( $this->plugin_slug . '-markerclusterer' );
			wp_enqueue_script( $this->plugin_slug . '-custom-map' );
			$sh_ids= array('custommap'.$id);
			wp_localize_script( $this->plugin_slug . '-custom-map', 'custom_map_ids', $sh_ids );
			wp_localize_script( $this->plugin_slug . '-custom-map', 'custommap'.esc_attr($id), $elements );
			$output = '';
			$output .= '<div id="map-container" class="'.esc_attr($class).'">';
			$output .= '<div id="custommap'.esc_attr($id).'" class="custom_map custom_map_as_global">
			        <!-- map goes here -->
			    </div>
			</div>';
		} else {
			wp_enqueue_script( 'leaflet-maps-js-api' );
			wp_enqueue_script( $this->plugin_slug . '-markerclusterer' );
			wp_enqueue_script( $this->plugin_slug . '-custom-map' );
			wp_localize_script( $this->plugin_slug . '-custom-map', 'custommap'.esc_attr($id), $elements );
			$output ='
			<div class="custom-map-container '.esc_attr($class).'" >
			    <div id="custommap'.esc_attr($id).'" class="custom_map" style="width:'.esc_attr($width).' ; height:'.esc_attr($height).'">
			        <!-- map goes here -->
			    </div>
			</div>';
		}
		return $output;
	}
	public function infobox_image_size(){
		$general_settings = get_option( 'travellerpress_general_settings' );
		$height = (isset($general_settings['infobox_height'])) ? $general_settings['infobox_height'] : 200 ;
		$width = (isset($general_settings['infobox_width'])) ? $general_settings['infobox_width'] : 300 ;
		add_image_size( 'travellerpress',  $width, $height, true ); //mobile
	}
}
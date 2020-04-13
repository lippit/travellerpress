<?php
/**
 * Plugin Name.
 *
 * @package   TravellerPress_Admin
 * @author    Your Name <email@example.com>
 * @license   GPL-2.0+
 * @link      http://example.com
 * @copyright 2014 Your Name or Company Name
 */

/**
 * Plugin class. This class should ideally be used to work with the
 * administrative side of the WordPress site.
 *
 * If you're interested in introducing public-facing
 * functionality, then refer to `class-plugin-name.php`
 *
 * @TODO: Rename this class to a proper name for your plugin.
 *
 * @package TravellerPress_Admin
 * @author  Your Name <email@example.com>
 */
class TravellerPress_Admin {

	/**
	 * Instance of this class.
	 *
	 * @since    1.0.0
	 *
	 * @var      object
	 */
	protected static $instance = null;

	/**
	 * Slug of the plugin screen.
	 *
	 * @since    1.0.0
	 *
	 * @var      string
	 */
	protected $plugin_screen_hook_suffix = null;

	/**
	 * Initialize the plugin by loading admin scripts & styles and adding a
	 * settings page and menu.
	 *
	 * @since     1.0.0
	 */
	private function __construct() {

		/*
		 * @TODO :
		 *
		 * - Uncomment following lines if the admin class should only be available for super admins
		 */
		/* if( ! is_super_admin() ) {
			return;
		} */

		/*
		 * Call $plugin_slug from public plugin class.
		 *
		 * @TODO:
		 *
		 * - Rename "TravellerPress" to the name of your initial plugin class
		 *
		 */
		$plugin = TravellerPress::get_instance();
		$this->plugin_slug = $plugin->get_plugin_slug();

		// Load admin style sheet and JavaScript.
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_admin_styles' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_admin_scripts' ) );

		// Add the options page and menu item.
		add_action( 'admin_menu', array( $this, 'add_plugin_admin_menu' ) );
		add_action( 'admin_init', array( $this, 'travellerpress_settings_init' ));

		add_action( 'admin_head', array( $this, 'add_map_data_admin_head' ) );
		add_filter( 'manage_tp_maps_posts_columns', array( $this, 'tp_modify_maps_table' ) );
		add_filter( 'manage_tp_maps_posts_custom_column', array( $this, 'tp_modify_maps_table_row' ), 10, 2 );

		// Add an action link pointing to the options page.
		$plugin_basename = plugin_basename( plugin_dir_path( realpath( dirname( __FILE__ ) ) ) . $this->plugin_slug . '.php' );
		add_filter( 'plugin_action_links_' . $plugin_basename, array( $this, 'add_action_links' ) );

		add_action( 'admin_notices', array( $this, 'wpvoyager_update_api_notice' ));

		/*
		 * Define custom functionality.
		 *
		 * Read more about actions and filters:
		 * http://codex.wordpress.org/Plugin_API#Hooks.2C_Actions_and_Filters
		 */
		add_action( 'add_meta_boxes', array( $this, 'add_map_meta_boxes' ) );
		add_action( 'save_post', array( $this, 'save_map_meta_box' ) );

	}

	/**
	 * Return an instance of this class.
	 *
	 * @since     1.0.0
	 *
	 * @return    object    A single instance of this class.
	 */
	public static function get_instance() {

		/*
		 * @TODO :
		 *
		 * - Uncomment following lines if the admin class should only be available for super admins
		 */
		/* if( ! is_super_admin() ) {
			return;
		} */

		// If the single instance hasn't been set, set it now.
		if ( null == self::$instance ) {
			self::$instance = new self;
		}

		return self::$instance;
	}

	/**
	 * Register and enqueue admin-specific style sheet.
	 *
	 * @TODO:
	 *
	 * - Rename "TravellerPress" to the name your plugin
	 *
	 * @since     1.0.0
	 *
	 * @return    null    Return early if no settings page is registered.
	 */
	public function enqueue_admin_styles() {

		if ( ! isset( $this->plugin_screen_hook_suffix ) ) {
			return;
		}
		$post_types = apply_filters('travellerpress_post_types', array('post','page','tp_maps'));
		$screen = get_current_screen();
		if ( $this->plugin_screen_hook_suffix == $screen->id || in_array($screen->id, $post_types) ) {
			wp_enqueue_style( $this->plugin_slug .'-admin-styles', plugins_url( 'assets/css/admin.css', __FILE__ ), array(), TravellerPress::VERSION );
		}

	}

	/**
	 * Register and enqueue admin-specific JavaScript.
	 *
	 * @TODO:
	 *
	 * - Rename "TravellerPress" to the name your plugin
	 *
	 * @since     1.0.0
	 *
	 * @return    null    Return early if no settings page is registered.
	 */
	public function enqueue_admin_scripts() {

		$general_settings = get_option( 'travellerpress_general_settings' );
        wp_register_style(
            'leaflet-maps-css',
            'https://unpkg.com/leaflet@1.6.0/dist/leaflet.css',
            array(),
            null
        );
        wp_register_script(
            'leaflet-maps-js-api',
            'https://unpkg.com/leaflet@1.6.0/dist/leaflet.js',
            array(),
            null
        );

        wp_enqueue_style( 'leaflet-maps-css' );
		wp_enqueue_script( 'leaflet-maps-js-api' );
		wp_enqueue_style( 'wp-color-picker' );
		//wp_enqueue_script( $this->plugin_slug . '-tabs', plugins_url( 'assets/js/tabs.js', __FILE__ ), array(  ) );
		if ( ! isset( $this->plugin_screen_hook_suffix ) ) {
			return;
		}

		$screen = get_current_screen();

		if ( $this->plugin_screen_hook_suffix == $screen->id || $this->is_edit_page()) {
			wp_enqueue_media();

			wp_enqueue_script( $this->plugin_slug . '-admin-script', plugins_url( 'assets/js/admin.js', __FILE__ ), array( 'jquery','jquery-ui-tabs','jquery-ui-sortable', 'wp-color-picker' ), TravellerPress::VERSION );
		}
		if (  $this->plugin_screen_hook_suffix == $screen->id ) {  //$this->plugin_screen_hook_suffix == $screen->id  ||
			wp_enqueue_script( $this->plugin_slug . '-options-script', plugins_url( 'assets/js/options.js', __FILE__ ), array( 'jquery' ), TravellerPress::VERSION );
		}


	}

	function wpvoyager_update_api_notice() {
        /*
		$general_settings = get_option( 'travellerpress_general_settings' );
		if(!isset($general_settings['api']) || empty($general_settings['api'])) {
		    ?>
		    <div class="error notice">
		        <p><?php _e( 'Hi! Since last changes in Google Maps <strong>it\'s required now to provide API</strong> to be able to include maps on your page. You can do it in <a href="' . admin_url( 'admin.php?page=' . $this->plugin_slug ) . '">' . __( 'TravellerPress Settings', $this->plugin_slug ) . '</a>. Visit this <a target="_blank" href="https://console.developers.google.com/flows/enableapi?apiid=maps_backend,geocoding_backend,directions_backend,distance_matrix_backend,elevation_backend&keyType=CLIENT_SIDE&reusekey=true">link</a> to generate API key for your website. <strong>Here is helpful <a href="http://www.docs.purethemes.net/travelmatic/knowledge-base/getting-an-api-key/" target="_blank">guide</a></strong>.', 'travellerpress' ); ?></p>
		    </div>
		    <?php
        }
        */
	}


	/**
	 * Register the administration menu for this plugin into the WordPress Dashboard menu.
	 *
	 * @since    1.0.0
	 */
	public function add_plugin_admin_menu() {

		/*
		 * Add a settings page for this plugin to the Settings menu.
		 *
		 * NOTE:  Alternative menu locations are available via WordPress administration menu functions.
		 *
		 *        Administration Menus: http://codex.wordpress.org/Administration_Menus
		 *
		 * @TODO:
		 *
		 * - Change 'Page Title' to the title of your plugin admin page
		 * - Change 'Menu Text' to the text for menu item for the plugin settings page
		 * - Change 'manage_options' to the capability you see fit
		 *   For reference: http://codex.wordpress.org/Roles_and_Capabilities
		 */

		if (isset( $_GET['page']) && $_GET['page'] == 'travellerpress' ) {

	        if ( isset($_POST['formaction']) && 'save_global' == $_POST['formaction'] ) {
	        	$mappoints_data = array();
	 			$i=0;
	            foreach ($_POST['mappoints_pointaddress'] as $k => $v) {
	            	if(!empty($v)){
		                $mappoints_data[] = array(
		                    'pointaddress' => sanitize_text_field($v),
		                    'pointlat' => sanitize_text_field($_POST['mappoints_pointlat'][$k]),
		                    'pointlong' => sanitize_text_field($_POST['mappoints_pointlong'][$k]),
		                    'pointdata' => wp_kses_post($_POST['mappoints_pointdata'][$k]),
		                    'pointtitle' => sanitize_text_field($_POST['mappoints_pointtitle'][$k]),
		                    'pointurl' => sanitize_text_field($_POST['mappoints_pointurl'][$k]),
		                    'image' => sanitize_text_field($_POST['mappoints_image'][$k]),
		                    'icon' => sanitize_text_field($_POST['mappoints_icon'][$k]),
		                    'pointicon_image' => sanitize_text_field($_POST['mappoints_icon_image'][$k]),
		                    'id' => $i,
		                );
		                $i++;
		            }
	            }
	            update_option('tp_global_mappoints_value', $mappoints_data);

	            $mappolygons_data = array();
	            $i=0;
	            foreach ($_POST['mappolygons_encodedpolygon'] as $k => $v) {
	            	if(!empty($v)){
		                $mappolygons_data[] = array(
		                    'encodedpolygon' => sanitize_text_field($v),
		                    'polygoncolor' => sanitize_text_field($_POST['mappolygons_polygoncolor'][$k]),
		                    'data' => wp_kses_post($_POST['mappolygons_polylinedata'][$k]),
		                    'title' => sanitize_text_field($_POST['mappolygons_pointtitle'][$k]),
		                    'pointurl' => sanitize_text_field($_POST['mappolygons_pointurl'][$k]),
		                    'image' => sanitize_text_field($_POST['mappolygons_image'][$k]),
		                    'id' => $i,
		                );
		                $i++;
		            }
	            }
	            update_option('tp_global_mappolygons_value', $mappolygons_data);

	            $mappolylines_data = array();
	            $i=0;
	            foreach ($_POST['mappolylines_encodedpolyline'] as $k => $v) {
	            	if(!empty($v)){
		                $mappolylines_data[] = array(
		                    'encodedpolyline' => sanitize_text_field($v),
		                    'polylinecolor' => sanitize_text_field($_POST['mappolylines_polylinecolor'][$k]),
		                    'data' => wp_kses_post($_POST['mappolylines_polylinedata'][$k]),
		                    'title' => sanitize_text_field($_POST['mappolylines_pointtitle'][$k]),
		                    'pointurl' => sanitize_text_field($_POST['mappolylines_pointurl'][$k]),
		                    'image' => sanitize_text_field($_POST['mappolylines_image'][$k]),
		                    'id' => $i,
		                );
		                $i++;
	                }
	            }
	            update_option('tp_global_mappolylines_value', $mappolylines_data);

	 			update_option('travellerpress_map_last_tab',$_POST['map_last_tab']);
	 			$mapkml_data = array();
	 			$i=0;
	            foreach ($_POST['mapkml_url'] as $k => $v) {
	            	if(!empty($v)){
		                $mapkml_data[] = array(
		                    'url' => sanitize_text_field($v),
		                    'id' => $i
		                );
		                $i++;
		            }
	            }
	            update_option('tp_global_mapkml_value', $mapkml_data);


				foreach ($_POST['travellerpress_globalMapSettings'] as $k => $v) {
					$mapoptions[$k] = $v;
				};

	            update_option( 'travellerpress_globalMapSettings', $mapoptions);

				/*header("Location: options-general.php?page=travellerpress&saved=true");
	            die;*/
	        }
  		}
  		if(function_exists('travelmatic_setup')) {
  			$this->plugin_screen_hook_suffix = add_submenu_page(
  				'travelmatic-core',
				__( 'Map Options', $this->plugin_slug ),
				__( 'Map Options', $this->plugin_slug ),
				'manage_options',
				$this->plugin_slug,
				array( $this, 'display_plugin_admin_page' )
			);
		} else {
			$this->plugin_screen_hook_suffix = add_options_page(
				__( 'TravellerPress Options', $this->plugin_slug ),
				__( 'TravellerPress', $this->plugin_slug ),
				'manage_options',
				$this->plugin_slug,
				array( $this, 'display_plugin_admin_page' )
			);
	 	}

	}

	/**
	 * Render the settings page for this plugin.
	 *
	 * @since    1.0.0
	 */
	public function display_plugin_admin_page( $active_tab) {
		include_once( 'views/admin.php' );
	}

	/**
	 * Add settings action link to the plugins page.
	 *
	 * @since    1.0.0
	 */
	public function add_action_links( $links ) {

		return array_merge(
			array(
				'settings' => '<a href="' . admin_url( 'options-general.php?page=' . $this->plugin_slug ) . '">' . __( 'Settings', $this->plugin_slug ) . '</a>'
			),
			$links
		);

	}

	public function add_map_meta_boxes( $post_type ) {
        $post_types = apply_filters('travellerpress_post_types', array('post','page','tp_maps'));     //limit meta box to certain post types
		add_meta_box(
    		'map-meta-boxes',
    		__( 'Map editor', 'travellerpress' ),
    		array( $this, 'render_map_meta_box' ),
    		'post',
    		'normal',
    		'high'
 		);
        if ( in_array( $post_type, $post_types )) {


        	add_meta_box(
        		'map-meta-el-boxes',
        		__( 'Map elements editor', 'travellerpress' ),
        		array( $this, 'render_map_el_meta_box' ),
        		$post_type,
        		'normal',
        		'high'
        		);
        }
    }

    public function render_map_meta_box() {
		require_once plugin_dir_path( __FILE__ ) . 'partials/map-meta-main.php';
	}

	public function render_map_el_meta_box() {
		require_once plugin_dir_path( __FILE__ ) . 'partials/map-meta-fields.php';
	}

	function is_edit_page($new_edit = null){
	    global $pagenow;
	    //make sure we are on the backend
	    if (!is_admin()) return false;


	    if($new_edit == "edit")
	        return in_array( $pagenow, array( 'post.php',  ) );
	    elseif($new_edit == "new") //check for new post page
	        return in_array( $pagenow, array( 'post-new.php' ) );
	    else //check for either new or edit
	        return in_array( $pagenow, array( 'post.php', 'post-new.php' ) );
	}

	function add_map_data_admin_head() {
		global $post;
		global $pagenow;
    	if ($this->is_edit_page()){

			$meta_maps_point = array();
			$meta_maps_point_temp = get_post_meta($post->ID, 'mappoints_value', true);
			if(!empty($meta_maps_point_temp)){
				foreach ($meta_maps_point_temp as $point) {

					$ibcontet = '';
					$point_image_id = $point['image'];

					if(!empty($point_image_id)) {
						$point_image_src = wp_get_attachment_image_src( $point_image_id, 'medium' );
						$ibcontet .= '<img src="'.$point_image_src[0].'" alt=""/><i class="map-box-icon"></i>';
					}
					if(empty($point['pointtitle'])) { $title = $point['pointaddress']; } else {	$title = $point['pointtitle'];	}
					if(empty($point['pointdata'])) { $content = "";	} else { $content = $point['pointdata']; }
					if(empty($point['pointurl'])) { $url = "#";	} else { $url = $point['pointurl']; }

					$ibdata = $ibcontet.'<a href="'.esc_url($url).'"><h2>'.$title.'</h2></a></a><p>'.$content.'</p>';
					$point['ibdata'] = $ibdata;

					$meta_maps_point[] = $point;
				}
			}

			$meta_maps_polygons = array();
			$meta_maps_polygons_temp = get_post_meta($post->ID, 'mappolygons_value', true);
			if(!empty($meta_maps_polygons_temp)){
				foreach ($meta_maps_polygons_temp as $polygon) {
					$ibcontet = '';
					$polygon_image_id = $polygon['image'];

					if(!empty($polygon_image_id)) {
						$polygon_image_src = wp_get_attachment_image_src( $polygon_image_id, 'medium' );
						$ibcontet .= '<img src="'.$polygon_image_src[0].'" alt=""/><i class="map-box-icon"></i>';
					}
					if(empty($polygon['title'])) { $title = ''; } else { $title = $polygon['title'];	}
					if(empty($polygon['data'])) { $content = "";	} else { $content = $polygon['data']; }
					if(empty($point['pointurl'])) { $url = "#";	} else { $url = $point['pointurl']; }

					$ibdata = $ibcontet.'<a href="'.esc_url($url).'"><h2>'.$title.'</h2></a><p>'.$content.'</p>';
					$polygon['ibdata'] = $ibdata;

					$meta_maps_polygons[] = $polygon;
				}
			}


			$meta_maps_polylines = array();
			$meta_maps_polylines_temp = get_post_meta($post->ID, 'mappolylines_value', true);
			if(!empty($meta_maps_polylines_temp)){
				foreach ($meta_maps_polylines_temp as $polyline) {

					$ibcontet = '';
					$polyline_image_id = $polyline['image'];

					if(!empty($polyline_image_id)) {
						$polyline_image_src = wp_get_attachment_image_src( $polyline_image_id, 'medium' );
						$ibcontet .= '<img src="'.$polyline_image_src[0].'" alt=""/><i class="map-box-icon"></i>';
					}
					if(empty($polyline['title'])) { $title = ''; } else { $title = $polyline['title'];	}
					if(empty($polyline['data'])) { $content = "";	} else { $content = $polyline['data']; }
					if(empty($point['pointurl'])) { $url = "#";	} else { $url = $point['pointurl']; }

					$ibdata = $ibcontet.'<a href="'.esc_url($url).'"><h2>'.$title.'</h2></a><p>'.$content.'</p>';
					$polyline['ibdata'] = $ibdata;

					$meta_maps_polylines[] = $polyline;
				}
			}


			$meta_maps_kml = get_post_meta($post->ID, 'mapkml_value', true);



			/*main map point*/
			$mappoint = array(
				'address' 	=>  get_post_meta($post->ID, 'main_point_longitude',true),
				'lat'		=>  get_post_meta($post->ID, 'main_point_latitude',true),
				'lng' 		=>  get_post_meta($post->ID, 'main_point_longitude',true),
				'color' 	=>  get_post_meta($post->ID, 'main_point_color', true),
				'image' 	=>  get_post_meta($post->ID, 'main_point_image', true),
				'icon_image'=>  get_post_meta($post->ID, 'main_point_icon_image', true),
				'title' 	=>  get_post_meta($post->ID, 'main_point_title', true),
				'text' 		=>  get_post_meta($post->ID, 'main_point_text', true),
				);

			$options = get_option( 'travellerpress_globalMapSettings' );
			$map_custom_center_open = (isset($options['map_custom_center_open']) && $options['map_custom_center_open'] != '') ? $options['map_custom_center_open'] : '';


		?>
		<script type="text/javascript" >
    		var locations = <?php echo json_encode($meta_maps_point); ?>;
    		var polygons = <?php echo json_encode($meta_maps_polygons); ?>;
    		var polylines = <?php echo json_encode($meta_maps_polylines); ?>;
    		var kml = <?php echo json_encode($meta_maps_kml); ?>;
	   		var mpPoint = <?php echo json_encode($mappoint); ?>;
	   		var centerPoint =  <?php echo json_encode($map_custom_center_open); ?>
    	</script>
	<?php }
	$screen = get_current_screen();

	if(isset($screen) && $this->plugin_screen_hook_suffix == $screen->id ) {

			$meta_maps_polygons = array();
			$meta_maps_polygons_temp = get_option( 'tp_global_mappolygons_value' );
			if(!empty($meta_maps_polygons_temp)){
				foreach ($meta_maps_polygons_temp as $polygon) {
					$ibcontet = '';
					$polygon_image_id = $polygon['image'];

					if(!empty($polygon_image_id)) {
						$polygon_image_src = wp_get_attachment_image_src( $polygon_image_id, 'medium' );
						$ibcontet .= '<img src="'.$polygon_image_src[0].'" alt=""/><i class="map-box-icon"></i>';
					}
					if(empty($polygon['title'])) { $title = ''; } else { $title = $polygon['title'];	}
					if(empty($polygon['data'])) { $content = "";	} else { $content = $polygon['data']; }
					if(empty($point['pointurl'])) { $url = "#";	} else { $url = $point['pointurl']; }

					$ibdata = $ibcontet.'<a href="'.esc_url($url).'"><h2>'.$title.'</h2></a><p>'.$content.'</p>';
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
						$polyline_image_src = wp_get_attachment_image_src( $polyline_image_id, 'medium' );
						$ibcontet .= '<img src="'.$polyline_image_src[0].'" alt=""/><i class="map-box-icon"></i>';
					}
					if(empty($polyline['title'])) { $title = ''; } else { $title = $polyline['title'];	}
					if(empty($polyline['data'])) { $content = "";	} else { $content = $polyline['data']; }
					if(empty($point['pointurl'])) { $url = "#";	} else { $url = $point['pointurl']; }

					$ibdata = $ibcontet.'<a href="'.esc_url($url).'"><h2>'.$title.'</h2></a><p>'.$content.'</p>';
					$polyline['ibdata'] = $ibdata;

					$meta_maps_polylines[] = $polyline;
				}
			}

			$meta_maps_kml =get_option('tp_global_mapkml_value');
			$args = array( 'posts_per_page' => -1 );

			$the_query = new WP_Query( $args );
			$markers = array(); $i = 0;

			$meta_maps_points = array();
			$meta_maps_points_temp = get_option( 'tp_global_mappoints_value' );
			if(!empty($meta_maps_points_temp)){
				foreach ($meta_maps_points_temp as $point) {
					if($point['image']){
						$point_image_src = wp_get_attachment_image_src( $point['image'], 'travellerpress' );
						$ibcontet .= '<a href="#" class="map-box-image"><img src="'.$point_image_src[0].'" alt=""/><i class="map-box-icon"></i></a>';
					}
					if(empty($point['pointtitle'])) { $title = $point['pointaddress']; } else {	$title = $point['pointtitle'];	}
					if(empty($point['pointdata'])) { $content = "";	} else { $content = $point['pointdata']; }
					if(empty($point['pointurl'])) { $url = "#";	} else { $url = $point['pointurl']; }

					$ibdata = $ibcontet.'<a href="'.esc_url($url).'"><h2>'.$title.'</h2></a><p>'.$content.'</p>';

					$mappoint = array(
							'pointaddress' =>  $point['pointaddress'],
							'pointlat' =>  $point['pointlat'],
							'pointlong' =>  $point['pointlong'],
							'icon' =>  $point['icon'],
							'pointicon_image' =>  $point['pointicon_image'],
							'id' => $i,
							'ibdata' => $ibdata,
							'ibmergecontent' => '',
							'ismerged' => 'no'
					);

					$i++;
					$markers[] = $mappoint;
				}
			}

			// The Loop
			if ( $the_query->have_posts() ) {

				while ( $the_query->have_posts() ) {
					$the_query->the_post();
					$lat = get_post_meta($the_query->post->ID, 'main_point_latitude',true);
					if (!empty($lat)) {

						$ibcontet = '';
						$point_image_id = get_post_meta($the_query->post->ID, 'main_point_image',true);

						if(!empty($point_image_id)) {
							$point_image_src = wp_get_attachment_image_src( $point_image_id, 'medium' );
						} else {
							$point_image_src = wp_get_attachment_image_src(  get_post_thumbnail_id(), 'medium' );
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

						$ibdata = $ibcontet.'<a href="'.esc_url(get_permalink()).'"><h2>'.$title.'</h2></a>'.$time_string.'<p>'.$content.'</p>';
						$ibmergecontent = '<li><a href="'.esc_url(get_permalink()).'">'.$title.'</a></li>';
						$mappoint = array(
							'pointaddress' =>  get_post_meta($the_query->post->ID , 'main_point_longitude',true),
							'pointlat' =>  $lat,
							'pointlong' =>  get_post_meta($the_query->post->ID, 'main_point_longitude',true),
							'icon' =>  get_post_meta($the_query->post->ID, 'main_point_color', true),
							'pointicon_image' =>  get_post_meta($the_query->post->ID, 'main_point_icon_image', true),
							'id' => $i,
							'ibdata' => $ibdata,
							'ibmergecontent' => $ibmergecontent,
							'ismerged' => 'no'
						);

					    $markers[] = $mappoint;
					    $i++;

					}
					//$markers[] = $mappoint;
				}
			}

			$options = get_option( 'travellerpress_globalMapSettings' );
			$map_custom_center_open = (isset($options['map_custom_center_open']) && $options['map_custom_center_open'] != '') ? $options['map_custom_center_open'] : '';

		?>

		<script type="text/javascript" >
    		var locations = <?php echo json_encode($markers); ?>;
    		var polygons = <?php echo json_encode($meta_maps_polygons); ?>;
    		var polylines = <?php echo json_encode($meta_maps_polylines); ?>;
    		var kml = <?php echo json_encode($meta_maps_kml); ?>;
			var mpPoint = {"address":"21.012228700000037","lat":"52.2296756","lng":"21.012228700000037","color":"#e20d0d","image":"","title":"","text":""};
			var centerPoint =  <?php echo json_encode($map_custom_center_open); ?>
    	</script>
	<?php }
	}

	/**
	 * Adds the meta box container.
	 *
	 * @since    1.0.0
	 */
	public function save_map_meta_box($post_id) {


			// Check if our nonce is set.
 			if ( ! isset( $_POST['main_map_nonce'] ) )
 				return $post_id;

 			$nonce = $_POST['main_map_nonce'];

			// Verify that the nonce is valid.
 			if ( ! wp_verify_nonce( $nonce, 'main_map' ) )
 				return $post_id;

			// If this is an autosave, our form has not been submitted,
	        //     so we don't want to do anything.
 			if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE )
 				return $post_id;

			// Check the user's permissions.
 			// if ( 'page' == $_POST['post_type'] ) {

 			// 	if ( ! current_user_can( 'edit_page', $post_id ) )
 			// 		return $post_id;

 			// } else {

 				if ( ! current_user_can( 'edit_post', $post_id ) )
 					return $post_id;
 			// }

 			/* OK, its safe for us to save the data now. */

 			/* save main map point */
 			if(isset($_POST['main_point_address'])) {
 				$main_point_address = sanitize_text_field( $_POST['main_point_address'] );
 				update_post_meta($post_id, 'main_point_address', $main_point_address);
 			}
 			if(isset($_POST['main_point_latitude'])) {
 				$main_point_latitude = sanitize_text_field( $_POST['main_point_latitude'] );
 				update_post_meta($post_id, 'main_point_latitude', $main_point_latitude);
 			}
 			if(isset($_POST['main_point_longitude'])) {
 				$main_point_longitude = sanitize_text_field( $_POST['main_point_longitude'] );
 				update_post_meta($post_id, 'main_point_longitude', $main_point_longitude);
 			}
 			if(isset($_POST['main_point_image'])) {
				$main_point_image = sanitize_text_field( $_POST['main_point_image'] );
 				update_post_meta($post_id, 'main_point_image', $main_point_image);
 			}
 			if(isset($_POST['main_point_title'])) {
 				$main_point_title = sanitize_text_field( $_POST['main_point_title'] );
 				update_post_meta($post_id, 'main_point_title', $main_point_title);
	 		}
	 		if(isset($_POST['main_point_text'])) {
 				$main_point_text = wp_kses_post( $_POST['main_point_text'] );
 				update_post_meta($post_id, 'main_point_text', $main_point_text);
 			}
 			if(isset($_POST['main_point_color'])){
 				$main_point_color = sanitize_text_field( $_POST['main_point_color'] );
	 			update_post_meta($post_id, 'main_point_color', $main_point_color);
			}
			if(isset($_POST['main_point_icon_image'])){
 				$main_point_icon_image = sanitize_text_field( $_POST['main_point_icon_image'] );
	 			update_post_meta($post_id, 'main_point_icon_image', $main_point_icon_image);
			}

 			$map_last_tab = sanitize_text_field( $_POST['map_last_tab'] );
 			update_post_meta($post_id, 'map_last_tab', $map_last_tab);

 			$mappoints_data = array();
 			$i=0;
 			if(isset($_POST['mappoints_pointaddress'])) {
	            foreach ($_POST['mappoints_pointaddress'] as $k => $v) {
	            	if(!empty($v)){
		                $mappoints_data[] = array(
		                    'pointaddress' => sanitize_text_field($v),
		                    'pointlat' => sanitize_text_field($_POST['mappoints_pointlat'][$k]),
		                    'pointlong' => sanitize_text_field($_POST['mappoints_pointlong'][$k]),
		                    'pointdata' => wp_kses_post($_POST['mappoints_pointdata'][$k]),
		                    'pointtitle' => sanitize_text_field($_POST['mappoints_pointtitle'][$k]),
		                    'pointurl' => sanitize_text_field($_POST['mappoints_pointurl'][$k]),
		                    'pointicon_image' => sanitize_text_field($_POST['mappoints_icon_image'][$k]),
		                    'image' => sanitize_text_field($_POST['mappoints_image'][$k]),
		                    'icon' => sanitize_text_field($_POST['mappoints_icon'][$k]),
		                    'id' => $i,
		                );
		                $i++;
		            }
	            }
	            update_post_meta($post_id, 'mappoints_value', $mappoints_data);
			}
            $mappolygons_data = array();
            $i=0;
            if(isset($_POST['mappolygons_encodedpolygon'])) {
	            foreach ($_POST['mappolygons_encodedpolygon'] as $k => $v) {
	            	if(!empty($v)){
		                $mappolygons_data[] = array(
		                    'encodedpolygon' => sanitize_text_field($v),
		                    'polygoncolor' => sanitize_text_field($_POST['mappolygons_polygoncolor'][$k]),
		                    'data' => wp_kses_post($_POST['mappolygons_polylinedata'][$k]),
		                    'title' => sanitize_text_field($_POST['mappolygons_pointtitle'][$k]),
		                    'pointurl' => sanitize_text_field($_POST['mappolygons_pointurl'][$k]),
		                    'image' => sanitize_text_field($_POST['mappolygons_image'][$k]),
		                    'id' => $i,
		                );
		                $i++;
		            }
	            }
	            update_post_meta($post_id, 'mappolygons_value', $mappolygons_data);
	        }

            $mappolylines_data = array();
            $i=0;
            foreach ($_POST['mappolylines_encodedpolyline'] as $k => $v) {
            	if(!empty($v)){
	                $mappolylines_data[] = array(
	                    'encodedpolyline' => sanitize_text_field($v),
	                    'polylinecolor' => sanitize_text_field($_POST['mappolylines_polylinecolor'][$k]),
	                    'data' => wp_kses_post($_POST['mappolylines_polylinedata'][$k]),
	                    'title' => sanitize_text_field($_POST['mappolylines_pointtitle'][$k]),
	                    'pointurl' => sanitize_text_field($_POST['mappolylines_pointurl'][$k]),
	                    'image' => sanitize_text_field($_POST['mappolylines_image'][$k]),
	                    'id' => $i,
	                );
	                $i++;
                }
            }
            update_post_meta($post_id, 'mappolylines_value', $mappolylines_data);


 			$mapkml_data = array();
 			$i=0;
            foreach ($_POST['mapkml_url'] as $k => $v) {
            	if(!empty($v)){
	                $mapkml_data[] = array(
	                    'url' => sanitize_text_field($v),
	                    'id' => $i
	                );
	                $i++;
	            }
            }
            update_post_meta($post_id, 'mapkml_value', $mapkml_data);


            $map_el_type = sanitize_text_field( $_POST['map_el_type'] );
 			update_post_meta($post_id, 'map_el_type', $map_el_type);

 			$map_auto_open = sanitize_text_field( $_POST['map_auto_open'] );
 			update_post_meta($post_id, 'map_auto_open', $map_auto_open);

 			$map_el_zoom = sanitize_text_field( $_POST['map_el_zoom'] );
 			update_post_meta($post_id, 'map_el_zoom', $map_el_zoom);

 			$map_el_style = sanitize_text_field( $_POST['map_el_style'] );
 			update_post_meta($post_id, 'map_el_style', $map_el_style);

 			$map_custom_center_open = sanitize_text_field( $_POST['map_custom_center_open'] );
 			update_post_meta($post_id, 'map_custom_center_open', $map_custom_center_open);

	}



	function travellerpress_settings_init(  ) {

		register_setting( 'mapStyles', 'travellerpress_settings' );

		add_settings_section(
			'travellerpress_mapStyles_section',
			'',
			array( $this,'travellerpress_settings_section_callback'),
			'mapStyles'
		);

		add_settings_field(
			'travellerpress_text_field_0',
			__( 'Saved map styles ', 'travellerpress' ),
			array( $this, 'travellerpress_mapstyles' ),
			'mapStyles',
			'travellerpress_mapStyles_section'
		);

		register_setting( 'mapGeneral', 'travellerpress_general_settings' );

		add_settings_section(
			'travellerpress_mapGeneral_section',
			'',
			array( $this,'travellerpress_settings_section_callback'),
			'mapGeneral'
		);


		add_settings_field(
			'travellerpress_api_field',
			__( 'Google API key for map features', 'travellerpress' ),
			array( $this, 'travellerpress_api_key' ),
			'mapGeneral',
			'travellerpress_mapGeneral_section'
		);

		add_settings_field(
			'travellerpress_map_height',
			__( 'Map height', 'travellerpress' ),
			array( $this, 'travellerpress_map_height' ),
			'mapGeneral',
			'travellerpress_mapGeneral_section'
		);

		add_settings_field(
			'travellerpress_marker_ratios',
			__( 'Icon marker size ratio', 'travellerpress' ),
			array( $this, 'travellerpress_marker_scale' ),
			'mapGeneral',
			'travellerpress_mapGeneral_section'
		);

		add_settings_field(
			'travellerpress_infobox_height',
			__( 'Markers infobox thumbnail height', 'travellerpress' ),
			array( $this, 'travellerpress_infobox_height' ),
			'mapGeneral',
			'travellerpress_mapGeneral_section'
		);

		add_settings_field(
			'travellerpress_infobox_width',
			__( 'Markers infobox width', 'travellerpress' ),
			array( $this, 'travellerpress_infobox_width' ),
			'mapGeneral',
			'travellerpress_mapGeneral_section'
		);

		add_settings_field(
			'travellerpress_clusters_status',
			__( 'Enable/disable Marker Clusters', 'travellerpress' ),
			array( $this, 'travellerpress_clusters_status' ),
			'mapGeneral',
			'travellerpress_mapGeneral_section'
		);

		add_settings_field(
			'travellerpress_min_cluster_size',
			__( 'Minimum Cluster Size', 'travellerpress' ),
			array( $this, 'travellerpress_min_cluster_size' ),
			'mapGeneral',
			'travellerpress_mapGeneral_section'
		);

		add_settings_field(
			'travellerpress_max_cluster_zoom',
			__( 'Maximum Cluster Zoom', 'travellerpress' ),
			array( $this, 'travellerpress_max_cluster_zoom' ),
			'mapGeneral',
			'travellerpress_mapGeneral_section'
		);



	}


	function travellerpress_mapstyles(  ) {

		$options = get_option( 'travellerpress_settings' );

		?>

		<ul id="mapstyle-list">
		<?php if(empty($options)) {?>
			<li data-id="0">
				<div class="tp-over-fold">
					<p>
						<label for="">Title</label>
						<input type="text" name="travellerpress_settings[0][title]" class="regular-text">
					</p>
				</div>
    			<div class="tp-foldable">
					<p>
						<label for=""><?php esc_html_e('Code','travellerpress'); ?></label>
						<textarea name="travellerpress_settings[0][style]" id="" cols="50" rows="10"></textarea>
					</p>
				</div>
				<a class="fold" href="#"><span class="dashicons dashicons-arrow-right toggle"></span></a>
				<a class="delete" href="#"><span class="dashicons dashicons-dismiss"></span></a>
			</li>

		<?php } else { ?>

				<?php
				$i=0;
				foreach ($options as $key) {
					if(!empty($key['style'])){  ?>
					<li data-id="<?php echo esc_attr($i);?>">
						<div class="tp-over-fold">
							<p>
								<label for=""><?php esc_html_e('Title','travellerpress'); ?></label>
								<input type="text" name="travellerpress_settings[<?php echo esc_attr($i);?>][title]" class="regular-text" value="<?php echo esc_attr($key['title']);?>">
							</p>
						</div>
            			<div class="tp-foldable">
							<p>
								<label for=""><?php esc_html_e('Code','travellerpress'); ?></label>
								<textarea name="travellerpress_settings[<?php echo esc_attr($i);?>][style]" id="" cols="50" rows="10"><?php echo esc_textarea($key['style']);?></textarea>
							</p>
						</div>
						<a class="fold" href="#"><span class="dashicons dashicons-arrow-right toggle"></span></a>
						<a class="delete" href="#"><span class="dashicons dashicons-dismiss"></span></a>
					</li>
				<?php $i++; }
				} ?>

		<?php } ?>
		</ul>
		<p class="description"><?php esc_html_e("You can use custom map styles with Google Maps so you won't need to use always the same boring map. There are two big sites with pre-made styles:",'travellerpress'); ?> <a href="https://snazzymaps.com/">Snazzy Maps</a> and <a href="http://www.mapstylr.com/">Mapstylr</a>.<?php esc_html_e(' Just copy one of the codes from that website and add here as your style','travellerpress'); ?></p><br><br>
		<input class="button-primary" type="submit" id="mapstyle_addnew" name="marker" value="<?php esc_attr_e( 'Add new style','travellerpress'  ); ?>" />

		<?php

	}


	function travellerpress_option_global_map_elements_callback(){
		esc_html_e( "<p>This is a global map - each point on map is representation of single post (unless more than one post is set to the exact same location). Using this panel you can add additional polylines, polygones or KML files to this map.</p>",'travellerpress');
	}

	function travellerpress_marker_scale(  ) {

		$options = get_option( 'travellerpress_general_settings' );

		if(isset($options['scale'])) {
			$scale = $options['scale'];
		} else {
			$scale = "1.1";
		}
		?>

		<select name="travellerpress_general_settings[scale]" id="mapsettings_markerscale">
			<option <?php selected( $scale, '0.4' ); ?> value="0.4">0.4</option>
			<option <?php selected( $scale, '0.5' ); ?> value="0.5">0.5</option>
			<option <?php selected( $scale, '0.6' ); ?> value="0.6">0.6</option>
			<option <?php selected( $scale, '0.7' ); ?> value="0.7">0.7</option>
			<option <?php selected( $scale, '0.8' ); ?> value="0.8">0.8</option>
			<option <?php selected( $scale, '0.9' ); ?> value="0.9">0.9</option>
			<option <?php selected( $scale, '1' ); ?> value="1">1</option>
			<option <?php selected( $scale, '1.1' ); ?> value="1.1">1.1</option>
			<option <?php selected( $scale, '1.2' ); ?> value="1.2">1.2</option>
		</select>
		<p class="description"><?php esc_html_e('If you feel your map is too cramped you can change the value of icons scale, default is 1.1, changing it to lower will make map icons smaller','travellerpress'); ?></p><br><br>


		<?php

	}

	function travellerpress_api_key(  ) {

		$options = get_option( 'travellerpress_general_settings', 1 );

		if(isset($options['api'])) {
			$api = $options['api'];
		} else {
			$api = "";
		}
        printf(
            '<input type="text" id="api" name="travellerpress_general_settings[api]" class="regular-text" value="%s" />',
            $api
        );
        echo '<p class="description">Since June 2016 it\'s required by Google Maps to provide API key to display maps on your page. Visit this <a href="https://console.developers.google.com/flows/enableapi?apiid=maps_backend,geocoding_backend,directions_backend,distance_matrix_backend,elevation_backend&keyType=CLIENT_SIDE&reusekey=true">link</a> to generate API key for your website.</p><strong>Here is helpful <a href="http://www.docs.purethemes.net/travelmatic/knowledge-base/getting-an-api-key/" target="_blank">guide</a></strong>.<br><br> ';

	}
	function travellerpress_map_height(  ) {

		$options = get_option( 'travellerpress_general_settings', 1 );


		if(isset($options['map_height'])) {
			$api = $options['map_height'];
		} else {
			$theme = wp_get_theme();
			if($theme->template == 'wpvoyager') {
				$api = '620px';
			} else {
				$api = '500px';
			}

		}
        printf(
            '<input type="text" id="map_height" name="travellerpress_general_settings[map_height]" class="regular-text" value="%s" />',
            $api
        );
        echo '<p class="description">Height of all maps, default is 500px</p> ';

	}


	function travellerpress_option_global_map_callback(  ) {

		$options = get_option( 'travellerpress_markers_settings', 1 );

		$checkbox = isset( $options ) ? esc_attr(  $options) : '';
        printf(
            '<input type="checkbox" id="auto" name="travellerpress_markers_settings" value="1" %s />',
            checked( 1, $checkbox, false )
        );

	}

	function travellerpress_settings_section_callback(  ) {

		//echo __( 'This section description', 'travellerpress' );

	}

	function travellerpress_clusters_status(  ) {

		$options = get_option( 'travellerpress_general_settings', 1 );

		$checkbox = isset( $options['clusters_status'] ) ? esc_attr(  $options['clusters_status']) : '';
        printf(
            '<input type="checkbox" id="auto" name="travellerpress_general_settings[clusters_status]" value="1" %s />',
            checked( 1, $checkbox, false )
        );
	}

	function travellerpress_infobox_width(  ) {

		$options = get_option( 'travellerpress_general_settings', 1 );

		if(isset($options['infobox_width'])) {
			$infobox_width = $options['infobox_width'];
		} else {
			$infobox_width = "300";
		}
        printf(
            '<input type="text" id="api" name="travellerpress_general_settings[infobox_width]" class="small-text" value="%s" />px',
            $infobox_width
        );
        echo '<p class="description">Run <a href="https://wordpress.org/plugins/regenerate-thumbnails/">Regenerate Thumbnails</a> plugin after changin width or height of infobox</p>';
	}
	function travellerpress_infobox_height(  ) {

		$options = get_option( 'travellerpress_general_settings', 1 );

		if(isset($options['infobox_height'])) {
			$infobox_height = $options['infobox_height'];
		} else {
			$infobox_height = "200";
		}
        printf(
            '<input type="text" id="api" name="travellerpress_general_settings[infobox_height]" class="small-text" value="%s" />px',
            $infobox_height
        );
        echo '<p class="description">Run <a href="https://wordpress.org/plugins/regenerate-thumbnails/">Regenerate Thumbnails</a> plugin after changin width or height of infobox</p>';
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

	function travellerpress_min_cluster_size(  ) {

		$options = get_option( 'travellerpress_general_settings', 1 );

		if(isset($options['min_cluster_size'])) {
			$min_cluster_size = $options['min_cluster_size'];
		} else {
			$min_cluster_size = "2";
		}
        printf(
            '<input type="text" id="api" name="travellerpress_general_settings[min_cluster_size]" class="small-text" value="%s" />',
            $min_cluster_size
        ); ?>
        <p class="description"><?php esc_html_e('The minimum number of markers to be in a cluster before the markers are hidden and a count is shown.','travellerpress'); ?></p><br><br>
        <?php
	}

	function travellerpress_max_cluster_zoom(  ) {

		$options = get_option( 'travellerpress_general_settings', 1 );

		if(isset($options['max_cluster_zoom'])) {
			$max_cluster_zoom = $options['max_cluster_zoom'];
		} else {
			$max_cluster_zoom = "19";
		}
        printf(
            '<input type="text" id="api" name="travellerpress_general_settings[max_cluster_zoom]" class="small-text" value="%s" />',
            $max_cluster_zoom
        );
        ?>
        <p class="description"><?php esc_html_e('The maximum zoom level that a marker can be part of a cluster.','travellerpress'); ?></p><br><br>
        <?php
	}



	function tp_modify_maps_table( $column ) {
	    $column['tp_maps_shortcode'] = esc_html__('Shortcode (copy&paste to post/page content)','travellerpress');
	    return $column;
	}

function tp_modify_maps_table_row( $column_name, $post_id ) {

    $custom_fields = get_post_custom( $post_id );

    switch ($column_name) {
        case 'tp_maps_shortcode' :
	        echo '<span class="shortcode"><input type="text" onfocus="this.select();" readonly="readonly" value="[tp-custom-map id=&quot;'.$post_id.'&quot; width=&quot;100%&quot; height=&quot;300px&quot;]" class="large-text code" /></span>';
            break;

        default:
    }
}




}

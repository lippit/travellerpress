<?php
/**
 * Represents the view for the administration dashboard.
 *
 *
 * @package   TravellerPress
 * @author    Your Name <email@example.com>
 * @license   GPL-2.0+
 * @link      http://purethemes.net
 * @copyright 2017 Purethemes
 */
?>
 
<div class="wrap">

	<div id="icon-themes" class="icon32"></div><h2><?php echo esc_html( get_admin_page_title() ); ?></h2>

		<h2>TravellerPress</h2>
		<?php 
		if( isset( $_GET[ 'tab' ] ) ) {
			$active_tab = $_GET[ 'tab' ];
		} else if( $active_tab == 'global_map_settings' ) {
			$active_tab = 'global_map_settings';
		} else {
			$active_tab = 'general';
		} // end if/else ?>
		
		<h2 class="nav-tab-wrapper">
			<a href="?page=travellerpress&tab=general" class="nav-tab <?php echo $active_tab == 'general' ? 'nav-tab-active' : ''; ?>"><?php _e( 'General Settings', 'sandbox' ); ?></a>
			<a href="?page=travellerpress&tab=global_map_settings" class="nav-tab <?php echo $active_tab == 'global_map_settings' ? 'nav-tab-active' : ''; ?>"><?php _e( 'Global Map Settings', 'sandbox' ); ?></a>
			<a href="?page=travellerpress&tab=map_styles" class="nav-tab <?php echo $active_tab == 'map_styles' ? 'nav-tab-active' : ''; ?>"><?php _e( 'Map Styles', 'sandbox' ); ?></a>
			
		</h2>
		<?php
		if($active_tab == 'map_styles'){
			echo "<form action='options.php' method='post'>";
			settings_fields( 'mapStyles' );
			do_settings_sections( 'mapStyles' );
			submit_button();
			echo "</form>";
		}	
		if($active_tab == 'general'){
			echo "<form action='options.php' method='post'>";
			settings_fields( 'mapGeneral' );
			do_settings_sections( 'mapGeneral' );
			submit_button();
			echo "</form>";
		}
		if($active_tab == 'global_map_settings'){
			  	settings_fields( 'globalMap' );
        		do_settings_sections('globalMap');
        		$options = get_option( 'travellerpress_globalMapSettings' );
		?>
<form method="POST" action="">
	<div id="main-point-map-manager">
		<div id="map-elements"></div>
		<div id="map-details-tabs">
	        <ul class="map-details-tabs">
	            <li><a data-tab="points" href="#points"><?php esc_html_e('Points','travellerpress') ?></a></li>
	            <li><a data-tab="polylines" href="#polylines"><?php esc_html_e('Polylines','travellerpress') ?></a></li>
	            <li><a data-tab="polygons" href="#polygons"><?php esc_html_e('Polygons','travellerpress') ?></a></li>
	            <li><a data-tab="kml" href="#kml"><?php esc_html_e('KML','travellerpress') ?></a></li>
	        </ul>
	        <div id="points">
	            <?php include_once('map-points.php') ?>
	        </div>
	        <div class="hidden" id="polylines">
	            <?php include_once('map-polylines.php') ?>
	        </div>
	        <div class="hidden" id="polygons">
	            <?php include_once('map-polygons.php') ?>
	        </div>  
	        <div class="hidden" id="kml">
	            <?php include_once('map-kml.php') ?>
	        </div>
	    </div>
	    <?php $lasttab = get_option( 'travellerpress_map_last_tab' ); ?>

		<input type="hidden" id="map_last_tab" name="map_last_tab" value="<?php echo esc_attr($lasttab); ?>">
		<?php submit_button(); ?>
		<div id="custom-meta-box-nonce" class="hidden">
		  <?php echo wp_create_nonce( 'map-manager-meta-box-nonce' ); ?>
		</div>
	    <div class="format-setting-label map-options-title"><h2><?php esc_html_e('Map Options','travellerpress') ?></h2></div>
	 
	    <table class="form-table">
	        <tr>
	            <th scope="row"><label for="map_el_type"><?php esc_html_e('Map type','travellerpress') ?></label></th>
	            <td>
	                <?php 
	                $map_el_type = ( isset($options['map_el_type']) && $options['map_el_type'] != '') ? $options['map_el_type'] : ''; ?> 
	                <select name="travellerpress_globalMapSettings[map_el_type]" style="width:100%">
	                    <option <?php selected( $map_el_type, 'ROADMAP'); ?> value="ROADMAP">ROADMAP</option>
	                    <option <?php selected( $map_el_type, 'HYBRID'); ?> value="HYBRID">HYBRID</option>
	                    <option <?php selected( $map_el_type, 'SATELLITE'); ?> value="SATELLITE">SATELLITE</option>
	                    <option <?php selected( $map_el_type, 'TERRAIN'); ?> value="TERRAIN">TERRAIN</option>
	                </select>
	            </td>
	        </tr> 

	        <tr>
	            <th scope="row"><label for="map_el_zoom"><?php esc_html_e('Map zoom','travellerpress') ?></label></th>
	            <td>
	                <?php $map_el_zoom = (isset($options['map_el_zoom']) && $options['map_el_zoom'] != '') ? $options['map_el_zoom'] : ''; ?> 
	                <select name="travellerpress_globalMapSettings[map_el_zoom]" style="width:100%">
	                    <option value="auto">auto</option>
	                    <?php for ($i=0; $i < 21 ; $i++) { 
	                        echo '<option '.selected( $map_el_zoom, $i, false).' value="'.$i.'">'.$i.'</option>';
	                    } ?>
	                </select> 
	            </td>
	        </tr>    
	        <?php $styles = get_option( 'travellerpress_settings' ); ?>    
	        <tr>
	            <th scope="row"><label  for="map_el_style"><?php esc_html_e('Map style','travellerpress') ?></label></th>
	            <td> 
	                <?php $map_el_style = (isset($options['map_el_style']) && $options['map_el_style'] != '') ? $options['map_el_style'] : '';?>
	                <select name="travellerpress_globalMapSettings[map_el_style]" style="width:100%">
	                    <option <?php selected( $map_el_style,'default') ?>value="default"><?php esc_html_e('default','travellerpress') ?></option>
	                    <?php 
	                    if($styles){
	                        foreach ($styles as $key => $value) {
	                            echo '<option '.selected( $map_el_style, $key, false).' value="'.$key.'">'.$value['title'].'</option>';
	                        } 
	                    }
	                    ?>
	                </select>
	            </td>
	        </tr>
	        <tr>
	            <th scope="row"><label for="map_auto_open"><?php esc_html_e('Auto open first marker','travellerpress') ?></label></th>
	            <td>
	                <?php $map_auto_open = (isset($options['map_auto_open']) && $options['map_auto_open'] != '') ? $options['map_auto_open'] : '';?> 
	                <select name="travellerpress_globalMapSettings[map_auto_open]" style="width:100%">
	                    <option <?php selected($map_auto_open, '0'); ?> value="0"><?php esc_html_e('no','travellerpress'); ?></option>
	                    <option <?php selected($map_auto_open, '1'); ?> value="1"><?php esc_html_e('yes','travellerpress'); ?></option>
	                </select> 
	            </td>
	        </tr>     
	        <tr>
	            <th scope="row"><label for="map_custom_center_open"><?php esc_html_e('Custom center point','travellerpress') ?></label></th>
	            <td>
	                <?php $map_custom_center_open = (isset($options['map_custom_center_open']) && $options['map_custom_center_open'] != '') ? $options['map_custom_center_open'] : '';?> 
	              
	                <input type="text" class="center_map_point" name="travellerpress_globalMapSettings[map_custom_center_open]" value="<?php echo $map_custom_center_open; ?>"> <a class="clear_center_map_point" href="#"><?php esc_html_e('clear','travellerpress'); ?></a> 
	                <p class="description"><?php esc_html_e('This point will be used as map center, and markers position will be ignored.','travellerpress'); ?></p>
	                
	            </td>
	        </tr>    
	    </table>
	    	<input type="hidden" name="formaction" value="save_global" />
				<?php submit_button(); ?>
			
				</div>
	</form>
	<?php } //eof global_map_settings?>
	
</div>  
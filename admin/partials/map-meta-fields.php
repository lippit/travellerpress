<?php
/**
 * Displays the user interface for the Single Post Meta Manager meta box.
 *
 * This is a partial template that is included by the Single Post Meta Manager
 * Admin class that is used to display all of the information that is related
 * to the post meta data for the given post.
 *
 * @package    SPMM
 */
global $post;
    
?>
<div id="main-point-map-manager">
    <?php wp_nonce_field('main_map','main_map_nonce'); ?>
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

	<div id="custom-meta-box-nonce" class="hidden">
	  <?php echo wp_create_nonce( 'map-manager-meta-box-nonce' ); ?>
	</div>
	<?php $lasttab = get_post_meta($post->ID, 'map_last_tab', true); ?>
	<input type="hidden" id="map_last_tab" name="map_last_tab" value="<?php echo esc_attr($lasttab); ?>">
    <br>
    <div class="format-setting-label"><h2><?php esc_html_e('Map options','travellerpress') ?></h2></div>
   
    <table class="form-table">
        <tr>
            <th scope="row"><label for="map_el_type"><?php esc_html_e('Map type','travellerpress') ?></label></th>
            <td>
                <?php $map_el_type = get_post_meta($post->ID, 'map_el_type', true); ?> 
                <select name="map_el_type" style="width:100%">
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
                <?php $map_el_zoom = get_post_meta($post->ID, 'map_el_zoom', true); ?> 
                <select name="map_el_zoom" style="width:100%">
                    <option value="auto"><?php esc_html_e('auto','travellerpress'); ?></option>
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
                <?php $map_el_style = get_post_meta($post->ID, 'map_el_style', true); ?>
                <select name="map_el_style" style="width:100%">
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
                <?php $map_auto_open = get_post_meta($post->ID, 'map_auto_open', true); ?> 
                <select name="map_auto_open" style="width:100%">
                    <option <?php selected($map_auto_open, 'no'); ?> value="no"><?php esc_html_e('no','travellerpress'); ?></option>
                    <option <?php selected($map_auto_open, 'yes'); ?> value="yes"><?php esc_html_e('yes','travellerpress'); ?></option>
                </select> 
            </td>
        </tr> 
         <tr>
            <th scope="row"><label for="map_custom_center_open"><?php esc_html_e('Custom center point','travellerpress') ?></label></th>
            <td>
                <?php 
                $map_custom_center_open = get_post_meta($post->ID, 'map_custom_center_open', true); ?> 
              
                <input type="text" class="center_map_point" name="map_custom_center_open" value="<?php echo $map_custom_center_open; ?>"> <a class="clear_center_map_point" href="#"><?php esc_html_e('clear','travellerpress'); ?></a> 
                <p class="description"><?php esc_html_e('This point will be used as map center, and markers position will be ignored.','travellerpress'); ?></p>
            </td>
        </tr>       
    </table>
  
</div><!-- #single-post-meta-manager -->
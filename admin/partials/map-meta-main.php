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

	<h3><?php esc_html_e('Post Main marker','travellerpress') ?></h3>

	<div id="main-point-map"></div>
	<div id="main-point-form">
		<p>
	    	<label for="main_point_address"><?php esc_attr_e('Address','travellerpress'); ?></label>
	    	<?php $mpLat = get_post_meta($post->ID, 'main_point_address', true); ?>
	        <input class="regular-text main_point_address" name="main_point_address" type="text" placeholder="<?php esc_attr_e('Address','travellerpress'); ?>" value="<?php echo esc_attr($mpLat); ?>" />
	    </p>
	    <p>
	    	<label for="main_point_latitude"><?php esc_attr_e('Latitude','travellerpress'); ?></label>
	    	<?php $mpLat = get_post_meta($post->ID, 'main_point_latitude', true); ?>
	        <input class="regular-text main_point_latitude" name="main_point_latitude" type="text" placeholder="<?php esc_attr_e('Latitude','travellerpress'); ?>" value="<?php echo esc_attr($mpLat); ?>" />
	    </p>
	    <p>
	    	<label for="main_point_longitude"><?php esc_attr_e('Longitude','travellerpress'); ?></label>
			<?php $mpLong = get_post_meta($post->ID, 'main_point_longitude', true); ?>
			<input class="regular-text main_point_longitude" name="main_point_longitude" type="text" placeholder="<?php esc_attr_e('Longitude','travellerpress'); ?>" value="<?php echo esc_attr($mpLong); ?>" />
	    </p>
	    <hr>
	    <p>
	    	<label for="main_point_color" id="main_point_color-label"><?php _e('Marker icon color','travellerpress'); ?></label>
	    	<?php $mpColor = get_post_meta($post->ID, 'main_point_color', true); ?>
	        <input name="main_point_color" type="text" value="<?php echo esc_attr($mpColor); ?>" class="travellpress-color-field" /> 
		</p>
		 <p>
	    	<label><?php _e('Marker icon image','travellerpress'); ?></label>
	    	<?php $mpMarkerIcon = get_post_meta($post->ID, 'main_point_icon_image', true); ?>
            <input name="main_point_icon_image" type="text"  value="<?php if(isset($mpMarkerIcon)) { echo esc_attr($mpMarkerIcon); } ?>"/>
            <?php if( isset($mpMarkerIcon) ) { echo '<img style="max-height: 20px; width: auto;margin-left: 10px;" src="'.$mpMarkerIcon.'"/>'; } ?>
            <p class="description"><?php _e('Optional link to image with icon for the marker', 'travellerpress'); ?></p>
	    </p>
	     <hr>
		<?php 
			$upload_link = esc_url( get_upload_iframe_src( 'image', $post->ID ) );
			$point_image_id =  get_post_meta($post->ID, 'main_point_image', true); ;
			$point_image_src = wp_get_attachment_image_src( $point_image_id, 'medium' );
			$you_have_img = is_array( $point_image_src );
		?>
		<div class="main-point-img-container">
		    <?php if ( $you_have_img ) : ?>
		        <img src="<?php echo esc_url($point_image_src[0]); ?>" alt="" style="max-width:100%;" />
		    <?php endif; ?>
		</div>

		<p class="hide-if-no-js">
		<label for=""><?php _e('Marker Infobox Thumbnail','travellerpress'); ?></label>
		    <a class="main-upload-point-image button button-primary<?php if ( $you_have_img  ) { echo 'hidden'; } ?>" 
		       href="<?php echo esc_url($upload_link); ?>">
		        <?php _e('Set image ','travellerpress') ?>
		    </a>
		    <a class="main-delete-point-image <?php if ( ! $you_have_img  ) { echo 'hidden'; } ?>" 
		      href="#">
		        <?php _e('Remove this image','travellerpress') ?>
		    </a>
		</p>
		<!-- A hidden input to set and post the chosen image id -->
		<input name="main_point_image" type="hidden" value="<?php esc_attr_e($point_image_id); ?>"  class="main-point-img-id" />

		<p>
		    <label><?php _e('Marker Title','travellerpress'); ?></label>
		    <?php $mpTitle = get_post_meta($post->ID, 'main_point_title', true); ?>
		    <input name="main_point_title" type="text" value="<?php echo esc_attr( $mpTitle); ?>" class="point-title regular-text" />
		    <p class="description"><?php esc_html_e('If not specified, post title will be used','travellerpress'); ?></p>
		</p>	
	    <p>
	    	<label for="main_point_text"><?php _e('Marker Content','travellerpress'); ?></label>
	    	<i><?php esc_html_e('If not specified, first few words from post content will be used','travellerpress'); ?></i>
			<?php $mpText = get_post_meta($post->ID, 'main_point_text', true); ?>
			<?php
			$settings = array( 'media_buttons' => false, 'teeny' => true, 'editor_height' => 150 );
			wp_editor( $mpText, 'main_point_text',$settings ); ?>
			
	    </p>
	    
	</div>

</div><!-- #single-post-meta-manager -->
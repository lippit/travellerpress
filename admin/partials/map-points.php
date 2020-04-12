<table id="mappoints-datatable" class="tp-map-table widefat">

<?php 
$mappoints_value = get_post_meta($post->ID, 'mappoints_value', true); 
if(empty($mappoints_value)) { ?>
	<tr>
		<td colspan="3"><?php esc_html_e('Click "Add Marker" to add first point','travellerpress'); ?></td>
	</tr>
<?php } else {

	foreach ($mappoints_value as $key => $point) { ?>
	<tr data-markerid="<?php echo esc_attr($point['id']); ?>">
		<td class="tp-map-actions" style="width:60px;">
		    <a class="fold" href="#"><span class="dashicons dashicons-arrow-right toggle"></span></a>		    
		    <a class="linkto" href="#"><span class="dashicons dashicons-location"></span></a>
		    <a class="move" ><span class="dashicons dashicons-sort"></span></a>
		</td>
		<td class="address <?php echo "marker".$point['id']; ?>" data-markerid="<?php echo esc_attr($point['id']); ?>">
			<div class="tp-over-fold">
				<p>
					<label for="mappoints_pointaddress[]"><?php esc_attr_e('Marker Address','travellerpress'); ?></label><input name="mappoints_pointaddress[]"  type="text" placeholder="<?php esc_attr_e('Address','travellerpress'); ?>" value="<?php echo esc_attr($point['pointaddress']); ?>" class="regular-text address-search" autocomplete="off" /><br>
				</p>
			</div>
			<div class="tp-foldable" id="point-coord">
				<p>
				<label for=""><?php _e('Latitude','travellerpress'); ?></label>
					<input name="mappoints_pointlat[]"  type="text" placeholder="<?php _e('Latitude','travellerpress'); ?>" value="<?php echo esc_attr($point['pointlat']); ?>" class="regular-text point-lat" />
				</p><p>
					<label for=""><?php _e('Longitude','travellerpress'); ?></label><input name="mappoints_pointlong[]" type="text" placeholder="<?php _e('Longitude','travellerpress'); ?>" value="<?php echo esc_attr($point['pointlong']); ?>" class="regular-text point-long" />
				</p>
			    <p>
	                <label><strong><?php _e('Marker icon color','travellerpress'); ?></strong></label>
	                <input name="mappoints_icon[]" type="text" value="<?php echo esc_attr($point['icon']); ?>" class="travellpress-color-field" />
	            </p>		    
	            <p>
	                <label><strong><?php _e('Marker icon image','travellerpress'); ?></strong></label>
	                <input name="mappoints_icon_image[]" type="text" value="<?php  if(isset($point['pointicon_image'])) echo esc_attr($point['pointicon_image']); ?>" class="regular-text" />
	                 <?php if(isset($point['pointicon_image'])) { echo '<img style="max-height: 20px; width: auto;margin-left: 10px;" src="'.$point['pointicon_image'].'"/>'; } ?>
	                <br><span><?php _e('Optional link to image with icon for the marker', 'travellerpress'); ?></span>
	            </p>			    
	 
	            <!-- Your add & remove image links -->
	            <hr/>
	            <h3><?php _e('InfoBox settings','travellerpress') ?></h3>
	            
	            <?php 
					$upload_link = esc_url( get_upload_iframe_src( 'image', $post->ID ) );
					$point_image_id = $point['image'];
					$point_image_src = wp_get_attachment_image_src( $point_image_id, 'medium' );
					$you_have_img = is_array( $point_image_src );
					?>

				<div class="point-img-container">
					<h4 class="point-marker-thumb-title"><?php _e('Marker thumbnail','travellerpress') ?></h4>
				    <?php if ( $you_have_img ) : ?>
				        <img src="<?php echo esc_url($point_image_src[0]); ?>" alt="" style="max-width:100%;" />
				    <?php endif; ?>
				</div>

				<p class="hide-if-no-js point-marker-thumb-buttons ">
				    <a class="upload-point-image button <?php if ( $you_have_img  ) { echo 'hidden'; } ?>" 
				       href="<?php echo esc_url($upload_link); ?>">
				        <?php _e('Set image', 'travellerpress') ?>
				    </a>
				    <a class="delete-point-image <?php if ( $you_have_img  ) { echo 'hidden'; } ?>" 
				      href="#">
				        <?php _e('Remove this image', 'travellerpress') ?>
				    </a>
				</p>
				<!-- A hidden input to set and post the chosen image id -->
				<input name="mappoints_image[]" type="hidden" value="<?php echo esc_attr( $point_image_id ); ?>" class="point-img-id" />
				<div style="clear:both"></div>
				<p>
			        <label><strong><?php _e('Marker URL','travellerpress'); ?></strong></label>
			        <input  name="mappoints_pointurl[]" type="text" class="point-url regular-text" 
			        value="<?php if(isset($point['pointurl'])) echo esc_attr($point['pointurl']); ?>" />
			    </p>
				<p>
			        <label><strong><?php _e('Marker Title','travellerpress'); ?></strong></label>
			        <input  name="mappoints_pointtitle[]" type="text" class="point-title regular-text" value="<?php echo esc_attr($point['pointtitle']); ?>" />
			    </p>
			    <p>
			        <label class="textarea-label"><strong><?php _e('Content','travellerpress'); ?></strong><br><?php _e('(html tags friendly)','travellerpress'); ?></label> 
			        <textarea rows="8" name="mappoints_pointdata[]" class="point-data regular-text"><?php echo esc_textarea($point['pointdata']); ?></textarea><br>
			    </p>
				
				
				
		    </div>
		</td>
		<td class="tp-map-actions" style="width:40px;">
		    <a class="delete" href="#"><span class="dashicons dashicons-dismiss"></span></a>
		</td>
	</tr>	
<?php }
} ?>

</table>

<input class="button-primary" type="submit" id="mappoints_addnew" name="marker" value="<?php esc_attr_e( 'Add new marker','travellerpress' ); ?>" />

<div style="display:none">
    <table class="point-clone">
		<tr>
		<td class="tp-map-actions" style="width:40px;">
		    <a class="fold" href="#"><span class="dashicons dashicons-arrow-right toggle"></span></a>
		    <a class="linkto" href="#"><span class="dashicons dashicons-location"></span></a>
		</td>
		<td class="address">
			<div class="tp-over-fold">
				<p><label for="mappoints_pointaddress[]"><?php esc_attr_e('Marker Address','travellerpress'); ?></label>
					<input name="mappoints_pointaddress[]"  type="text" placeholder="<?php _e('Address','travellerpress'); ?>" value="" class="regular-text address-search" autocomplete="off"/><br>
				</p>
			</div>
			<div class="tp-foldable">
				<p>
				<label for=""><?php _e('Latitude','travellerpress'); ?></label>
					<input name="mappoints_pointlat[]"  type="text" placeholder="<?php _e('Latitude','travellerpress'); ?>" value="" class="regular-text point-lat" />
				</p><p>
				<label for=""><?php _e('Longitude','travellerpress'); ?></label>
					<input name="mappoints_pointlong[]" type="text" placeholder="<?php _e('Longitude','travellerpress'); ?>" value="" class="regular-text point-long" />
				</p>
				<p>
			    	<label><strong><?php _e('Marker icon color','travellerpress'); ?></strong></label>
	                <input name="mappoints_icon[]" type="text" value="#6db70c" class="travellpress-color-field" />
			    </p>		
			    <p>
			    	<label><strong><?php _e('Marker icon image','travellerpress'); ?></strong></label>
	                <input name="mappoints_icon_image[]" type="text"  />
	                <br><span><?php _e('Optional link to image with icon for the marker', 'travellerpress'); ?></span>
			    </p>


		        <hr/>
	            <h3><?php _e('InfoBox settings','travellerpress') ?></h3>
				<?php 
				$upload_link = esc_url( get_upload_iframe_src( 'image', $post->ID ) );
				
				?>
				<div class="point-img-container">
				  	<h4 class="point-marker-thumb-title"><?php _e('Marker thumbnail','travellerpress') ?></h4>
				</div>

				<p class="hide-if-no-js point-marker-thumb-buttons ">
				    <a class="upload-point-image button" 
				       href="<?php echo esc_url($upload_link); ?>">
				        <?php _e('Set image for marker\'s infobox', 'travellerpress') ?>
				    </a>
				    <a class="delete-point-image hidden" href="#">
				        <?php _e('Remove this image', 'travellerpress') ?>
				    </a>
				</p>
				<!-- A hidden input to set and post the chosen image id -->
				<input name="mappoints_image[]" type="hidden" value="" class="point-img-id" />
				<div style="clear:both"></div>
				<p>
			        <label><strong><?php _e('Marker URL','travellerpress'); ?></strong></label>
			        <input  name="mappoints_pointurl[]" type="text" class="point-url regular-text" />
			    </p>
				<p>
			        <label><strong><?php _e('Title','travellerpress'); ?></strong></label>
			        <input  name="mappoints_pointtitle[]" type="text" class="point-title regular-text" />
			    </p>
			    <p>
			         <label class="textarea-label"><strong><?php _e('Content','travellerpress'); ?></strong><br><?php _e('(html tags friendly)','travellerpress'); ?></label> 
			        <textarea rows="8" name="mappoints_pointdata[]" class="point-data regular-text"></textarea><br>
			    </p>
		    </div>
		</td>
		<td class="tp-map-actions" style="width:40px;">
		    <a class="delete" href="#"><span class="dashicons dashicons-dismiss"></span></a>
		</td>
	</tr>
	</table>
</div>
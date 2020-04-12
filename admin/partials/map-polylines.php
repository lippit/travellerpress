<table id="mappolylines-datatable" class="tp-map-table widefat">
<?php 
$mappolylines_value = get_post_meta($post->ID, 'mappolylines_value', true);
if(empty($mappolylines_value)) { ?>
    <tr>
        <td colspan="3"><?php esc_html_e('Click "Add Polyline" to add first polyline','travellerpress'); ?></td>
	</tr>
<?php 
} else {
    foreach ($mappolylines_value as $key => $point) { ?>
     <tr data-polyid="<?php echo esc_attr($point['id']); ?>">
        <td class="tp-map-actions" style="width:40px;">
            <a class="fold" href="#"><span class="dashicons dashicons-arrow-right toggle"></span></a>
            <a class="linkto" href="#"><span class="dashicons dashicons-location"></span></a>
        </td>
        <td class="encode">
            <div class="tp-over-fold">
                <p>
                    <label><strong><?php _e('Encoded polyline','travellerpress'); ?></strong></label>
                    <input name="mappolylines_encodedpolyline[]" type="text" value="<?php echo esc_attr($point['encodedpolyline']); ?>" class="regular-text encoded"  /> 
                    <span class="button edit_this"><?php esc_html_e('Edit','travellerpress'); ?></span>
                    <span class="button stop_edit_this"><?php esc_html_e('Stop Edit','travellerpress'); ?></span>
                </p>
            </div>
            <div class="tp-foldable">
                <p>
                    <label><strong><?php _e('Polyline color','travellerpress'); ?></strong></label>
                    <input name="mappolylines_polylinecolor[]" type="text" value="<?php echo esc_attr($point['polylinecolor']); ?>" class="travellpress-color-field"/>
                </p>

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
                        <?php _e('Set image','travellerpress') ?>
                    </a>
                    <a class="delete-point-image <?php if ( ! $you_have_img  ) { echo 'hidden'; } ?>" 
                      href="#">
                        <?php _e('Remove this image','travellerpress') ?>
                    </a>
                </p>
                <!-- A hidden input to set and post the chosen image id -->
                <input name="mappolylines_image[]" type="hidden" value="<?php echo esc_attr( $point_image_id ); ?>" class="point-img-id" />
                <div style="clear:both"></div>
                <p>
                    <label><strong><?php _e('Infobox URL','travellerpress'); ?></strong></label>
                    <input  name="mappolylines_pointurl[]" type="text" class="point-url regular-text" 
                    value="<?php if(isset($point['pointurl'])) echo esc_attr($point['pointurl']); ?>" />
                </p>
                <p>
                    <label><strong><?php _e('Title','travellerpress'); ?></strong></label>
                    <input  name="mappolylines_pointtitle[]" type="text" class="point-title regular-text" value="<?php echo esc_attr($point['title']); ?>" />
                </p>
                <p>
                    <label class="textarea-label"><strong><?php _e('Content','travellerpress'); ?></strong><br><?php _e('(html tags friendly)','travellerpress'); ?></label>
                    <textarea rows="8" name="mappolylines_polylinedata[]" class="point-data regular-text"><?php echo esc_textarea($point['data']); ?></textarea><br>
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

<input class="button-primary" type="submit" id="mappolylines_addnew" name="marker" value="<?php esc_attr_e( 'Draw new polyline','travellerpress' ); ?>" />



<div style="display:none">
    <table class="polyline-clone">
        <tr>
            <td class="tp-map-actions" style="width:40px;">
                <a class="fold" href="#"><span class="dashicons dashicons-arrow-right toggle"></span></a>
                <a class="linkto" href="#"><span class="dashicons dashicons-location"></span></a>
            </td>
            <td class="encode">
                <div class="tp-over-fold">
                    <p>
                        <label><strong><?php _e('Encoded polyline','travellerpress'); ?></strong></label>
                        <input name="mappolylines_encodedpolyline[]" type="text" value="" class="regular-text encoded" />
                        <span class="button edit_this" style="display: none"><?php esc_html_e('Edit','travellerpress'); ?></span>
                        <span class="button stop_edit_this"><?php esc_html_e('Stop Edit','travellerpress'); ?></span>
                        <input class="button-secondary mappolylines_stop" type="submit"  name="marker" value="<?php esc_attr_e( 'Stop polyline','travellerpress' ); ?>" />
                    </p>
                </div>
                <div class="tp-foldable">
                    <p>
                        <label><strong><?php _e('Polyline color','travellerpress'); ?></strong></label>
                        <input name="mappolylines_polylinecolor[]" type="text" value="#000" class="travellpress-color-field"/>
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
                            <?php _e('Set image','travellerpress') ?>
                        </a>
                        <a class="delete-point-image hidden" href="#">
                            <?php _e('Remove this image','travellerpress') ?>
                        </a>
                    </p>
                    <!-- A hidden input to set and post the chosen image id -->
                    <input name="mappolylines_image[]" type="hidden" value="" class="point-img-id" />
                    <div style="clear:both"></div>
                    <p>
                        <label><strong><?php _e('Infobox URL','travellerpress'); ?></strong></label>
                        <input  name="mappolylines_pointurl[]" type="text" class="point-url regular-text" />
                    </p>
                    <p>
                        <label><strong><?php _e('Title','travellerpress'); ?></strong></label>
                        <input  name="mappolylines_pointtitle[]" type="text" class="point-title regular-text" />
                    </p>
                    <p>
                         <label class="textarea-label"><strong><?php _e('Content','travellerpress'); ?></strong><br><?php _e('(html tags friendly)','travellerpress'); ?></label> 
                        <textarea rows="8" name="mappolylines_polylinedata[]" class="point-data regular-text"></textarea><br>
                    </p>
                </div>
            </td>
            <td class="tp-map-actions" style="width:40px;">
                <a class="delete" href="#"><span class="dashicons dashicons-dismiss"></span></a>
            </td>
        </tr>
      
    </table>
</div>
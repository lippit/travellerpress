<table id="mapkml-datatable" class="tp-map-table widefat">
<?php 
$mapkml_value = get_option( 'tp_global_mapkml_value' );

if(empty($mapkml_value)) { ?>
	<tr>
        <td colspan="3"><?php esc_html_e('Click "Add new KML Layer" to add/upload first layer','travellerpress'); ?></td>
    </tr>
    <?php 
} else {
    foreach ($mapkml_value as $key => $point) { 
        ?>
    <tr data-kmlid="<?php echo esc_attr($point['id']); ?>">
        <td class="tp-map-actions" style="width:40px;">
            <a class="linkto" href="#"><span class="dashicons dashicons-location"></span></a>
        </td>
        <td class="url">
            <p>
                <label><strong><?php _e('URL to KML','travellerpress'); ?></strong></label>
                <input name="mapkml_url[]" type="text" value="<?php echo esc_attr($point['url']) ?>" class="regular-text"  />
                <?php $upload_link = esc_url( get_upload_iframe_src( 'image' ) ) ?>
                <span class="hide-if-no-js">
                        <a class="upload-point-kml button " 
                           href="<?php echo esc_url($upload_link); ?>">
                            <?php _e('Upload your KML file') ?>
                        </a>
                </span>
            </p>
        </td>
        <td class="tp-map-actions" style="width:40px;">
            <a class="delete" href="#"><span class="dashicons dashicons-dismiss"></span></a>
        </td>
    </tr>
         <?php }
} ?>
</table>

<input class="button-primary" type="submit" id="mapkml_addnew" name="kml" value="<?php esc_attr_e( 'Add new KML layer','travellerpress' ); ?>" />


<div style="display:none">
    <table class="kml-clone">
         <tr>
            <td class="tp-map-actions" style="width:40px;">
                <a class="linkto" href="#"><span class="dashicons dashicons-location"></span></a>
            </td>
            <td class="url">
                <p>
                    <label><strong><?php _e('URL to KML','travellerpress'); ?></strong></label>
                    <input name="mapkml_url[]" type="text" value="" class="regular-text"  />
                    <?php $upload_link =  get_upload_iframe_src( 'image' ); ?>
                    <span class="hide-if-no-js">
                            <a class="upload-point-kml button " 
                               href="<?php echo esc_url($upload_link); ?>">
                                <?php _e('Upload your KML file','travellerpress') ?>
                            </a>
                    </span>
                </p>
            </td>
            <td class="tp-map-actions" style="width:40px;">
                <a class="delete" href="#"><span class="dashicons dashicons-dismiss"></span></a>
            </td>
        </tr>
    </table>
</div>
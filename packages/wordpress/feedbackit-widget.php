<?php
/*
Plugin Name: FeedbackIt Widget
Description: Embeds the FeedbackIt widget via CDN.
Version: 0.1.0
*/

function feedbackit_widget_script() {
    $projectId = get_option('feedbackit_project_id', '');
    if ($projectId) {
        echo "<script src='https://unpkg.com/@feedbackit/widget-html/dist/widget.umd.js'></script>\n";
        echo "<script>FeedbackItWidget.init({ projectId: '" . esc_js($projectId) . "' });</script>\n";
    }
}
add_action('wp_footer', 'feedbackit_widget_script');

function feedbackit_widget_settings_page() {
    add_options_page('FeedbackIt Widget', 'FeedbackIt Widget', 'manage_options', 'feedbackit-widget', 'feedbackit_widget_settings_html');
}
add_action('admin_menu', 'feedbackit_widget_settings_page');

function feedbackit_widget_settings_html() {
    if (isset($_POST['feedbackit_project_id'])) {
        update_option('feedbackit_project_id', sanitize_text_field($_POST['feedbackit_project_id']));
        echo '<div class="updated"><p>Saved</p></div>';
    }
    $val = esc_attr(get_option('feedbackit_project_id', ''));
    echo '<form method="post"><input type="text" name="feedbackit_project_id" value="' . $val . '" /><input type="submit" value="Save" /></form>';
}
?>

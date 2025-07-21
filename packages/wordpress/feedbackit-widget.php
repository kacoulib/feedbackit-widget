<?php
/*
Plugin Name: FeedbackIt Widget
Description: Embeds the FeedbackIt widget via CDN.
Version: 0.1.0
*/

function feedbackit_widget_script() {
    $projectId = get_option('feedbackit_project_id', '');
    $lang = get_option('feedbackit_lang', '');
    if ($projectId) {
        echo "<script src='https://unpkg.com/@feedbackit/widget-html/dist/widget.umd.js'></script>\n";
        $args = "{ projectId: '" . esc_js($projectId) . "'";
        if ($lang) { $args .= ", lang: '" . esc_js($lang) . "'"; }
        $args .= " }";
        echo "<script>FeedbackItWidget.init($args);</script>\n";
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
        update_option('feedbackit_lang', sanitize_text_field($_POST['feedbackit_lang']));
        echo '<div class="updated"><p>Saved</p></div>';
    }
    $projectVal = esc_attr(get_option('feedbackit_project_id', ''));
    $langVal = esc_attr(get_option('feedbackit_lang', ''));
    echo '<form method="post">';
    echo '<p>Project ID: <input type="text" name="feedbackit_project_id" value="' . $projectVal . '" /></p>';
    echo '<p>Language: <select name="feedbackit_lang">';
    echo '<option value="">Auto</option>';
    echo '<option value="en"' . selected($langVal, 'en', false) . '>English</option>';
    echo '<option value="fr"' . selected($langVal, 'fr', false) . '>Français</option>';
    echo '</select></p>';
    echo '<p><input type="submit" value="Save" /></p>';
    echo '</form>';
}
?>

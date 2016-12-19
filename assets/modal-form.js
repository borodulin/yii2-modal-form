/**
 * @link https://github.com/borodulin/yii2-modal-form
 * @copyright Copyright (c) 2016 Andrey Borodulin
 * @license https://github.com/borodulin/yii2-modal-form/blob/master/LICENSE
 */
;
(function($) {
    $.ajaxPrefilter(function(options, originalOptions, jqXHR) {
        options.async = true;
    });
    $.fn.modalForm = function(options) {
        var self = this;
        var idCounter = 0;
        this.defaultOptions = {
            size : "",
            loginUrl : "",
            loadingContent : '<div class="modal-header">Loading...</div>'
                    + '<div class="modal-body">'
                    + '<div class="progress progress-striped active" style="margin-bottom:0;">'
                    + '<div class="progress-bar" style="width: 100%"></div>'
                    + '</div>' + '</div>',
            modalDialog : '<div class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">'
                    + '<div class="modal-dialog">'
                    + '<div class="modal-content"></div>' + '</div>' + '</div>'
        };

        var ajaxContent = function(ajax, $modalDialog) {
            var $content = $modalDialog.loadingContent();
            $modalDialog.modal('show');
            $.ajax($.extend(ajax, {
                success : function(response) {
                    $content.html(response);
                },
                error : function(jqXHR) {
                    if ((jqXHR.status === 401) && (settings.loginUrl)) {
                        ajaxContent({
                            url : settings.loginUrl
                        });
                    } else {
                        $content.html('<div class="error-summary">'
                                + jqXHR.responseText + '</div>');
                    }
                }
            }));
        };
        var doModal = function(options) {
            var settings = $.extend({}, self.defaultOptions, options);
            var $modalDialog = $(settings.modalDialog).attr('id',
                    'modalFormId-' + ++idCounter);
            $('body').append($modalDialog);
            $modalDialog.loadingContent = function() {
                return $modalDialog.find('.modal-content').html(
                        settings.loadingContent);
            };
            $modalDialog.on('hidden.bs.modal', function(e) {
                $(this).remove();
            });
            $modalDialog.on('submit', 'form', function(event) {
                event.preventDefault();
                var form = this;
                var $form = $(form);
                method = $form.attr('method').toLowerCase() || 'post';
                var ajax = {
                    url : $form.attr('action')
                };
                if (method == 'post') {
                    ajax.data = new FormData(form);
                    ajax.type = 'post';
                    ajax.enctype = 'multipart/form-data';
                    ajax.processData = false; // tell jQuery not to process
                                                // the data
                    ajax.contentType = false; // tell jQuery not to set
                                                // contentType
                } else {
                    ajax.data = $form.serialize();
                }
                ajaxContent(ajax, $modalDialog);
                return false;
            });
            return $modalDialog;
        };

        return this.each(function() {
            var $this = $(this);
            $this.on('click', function() {
                var $self = $(this), url = $self.data('url')
                        || $self.attr('href');
                $modalDialog = doModal($this.data());
                ajaxContent({
                    url : url
                }, $modalDialog);
                return false;
            });
        });
    };
})(window.jQuery);

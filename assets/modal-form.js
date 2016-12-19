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
            size : null,
            loginUrl : null,
            loading : '<div class="modal-header">Loading...</div>'
                    + '<div class="modal-body">'
                    + '<div class="progress progress-striped active" style="margin-bottom:0;">'
                    + '<div class="progress-bar" style="width: 100%"></div>'
                    + '</div>' + '</div>',
            modal : '<div class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">'
                    + '<div class="modal-dialog">'
                    + '<div class="modal-content"></div>' + '</div>' + '</div>',
            error : '<div class="error-summary"></div>'
        };

        var ajaxContent = function(ajax, $modalDialog) {
            $modalDialog.modal('show').loading();
            $.ajax($.extend(ajax, {
                success : function(response) {
                    $modalDialog.content(response);
                },
                error : function(jqXHR) {
                    if ((jqXHR.status === 401) && (settings.loginUrl)) {
                        ajaxContent({
                            url : settings.loginUrl
                        });
                    } else {
                        $modalDialog.error(jqXHR.responseText);
                    }
                }
            }));
        };
        
        var createModalDialog = function(dataOptions) {
            var settings = $.extend({}, self.defaultOptions, options, dataOptions);
            var $modalDialog = $(settings.modal).attr('id',
                    'modalFormId-' + ++idCounter);
            if (settings.size) {
                $modalDialog.addClass(settings.size);
            }
            $('body').append($modalDialog);
            var $content = $modalDialog.find('.modal-content');
            $modalDialog.loading = function() {
                return $content.html(settings.loading);
            };
            $modalDialog.error = function($error) {
                return $content.html($(settings.error).html($error));
            };
            $modalDialog.content = function(html) {
                return $content.html(html);
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
                    ajax.processData = false; // tell jQuery not to process the data
                    ajax.contentType = false; // tell jQuery not to set contentType
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
                var $self = $(this);
                var url = $self.data('url') || $self.attr('href');
                $modalDialog = createModalDialog($this.data());
                ajaxContent({url : url}, $modalDialog);
                return false;
            });
        });
    };
})(window.jQuery);

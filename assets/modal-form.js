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
    var idCounter = 0; 
    $.modalForm = function(options) {
        var self = this;
        this.defaultOptions = {
            selector: '.modal-form',
            singleton: true,
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

        var settings = $.extend({}, self.defaultOptions, options);
        
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
            var options = $.extend({}, settings, dataOptions);
            
            if (settings.singleton && self.modalDialog) {
                if ('size' in options) {
                    self.modalDialog.find('.modal-dialog').removeClass('modal-sm modal-lg').addClass(options.size);
                }
                return self.modalDialog;
            }
            var $modalDialog = $(options.modal).attr('id', 'modalFormId-' + ++idCounter);
            if (settings.singleton) {
                self.modalDialog = $modalDialog;    
            }
            if (options.size) {
                $modalDialog.find('.modal-dialog').addClass(options.size);
            }
            $('body').append($modalDialog);
            var $content = $modalDialog.find('.modal-content');
            $modalDialog.loading = function() {
                return $content.html(settings.loading);
            };
            $modalDialog.error = function($error) {
                return $content.html($(options.error).html($error));
            };
            $modalDialog.content = function(html) {
                return $content.html(html);
            };
            $modalDialog.on('hidden.bs.modal', function(e) {
                $(this).remove();
                if (settings.singleton) {
                    self.modalDialog = null;
                }
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
        $('body').on('click', settings.selector, function() {
            var $this = $(this);
            var url = $this.data('url') || $this.attr('href');
            $modalDialog = createModalDialog($this.data());
            ajaxContent({url : url}, $modalDialog);
            return false;
        });
    };
})(window.jQuery);

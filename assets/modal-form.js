/**
 * @link https://github.com/borodulin/yii2-modal-form
 * @copyright Copyright (c) 2016 Andrey Borodulin
 * @license https://github.com/borodulin/yii2-modal-form/blob/master/LICENSE
 */
;
(function($) {

    var idCounter = 0;

    var self = this;
    
    $.createModalForm = function(options) {
        options = $.extend({
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
        }, options);
        if (options.singleton && self.hasOwnProperty('modalDialog') && self.modalDialog) {
            if ('size' in options) {
                self.modalDialog.find('.modal-dialog').removeClass('modal-sm modal-lg').addClass(options.size);
            }
            return self.modalDialog;
        }
        var $modalDialog = $(options.modal).attr('id', 'modalFormId-' + ++idCounter);
        if (options.singleton) {
            self.modalDialog = $modalDialog;    
        }
        if (options.size) {
            $modalDialog.find('.modal-dialog').addClass(options.size);
        }
        $('body').append($modalDialog);
        var $content = $modalDialog.find('.modal-content');
        $modalDialog.loading = function() {
            return $content.html(options.loading);
        };
        $modalDialog.error = function($error) {
            return $content.html($(options.error).html($error));
        };
        $modalDialog.content = function(html) {
            return $content.html(html);
        };
        $modalDialog.on('hidden.bs.modal', function() {
            $(this).remove();
            if (options.singleton) {
                self.modalDialog = null;
            }
        });
        $modalDialog.ajaxContent = function(ajax) {
            $modalDialog.modal('show').loading();
            $.ajax($.extend(ajax, {
                success : function(response) {
                    $modalDialog.content(response);
                    if ('success' in options) {
                        eval(options.success);
                    }
                },
                error : function(jqXHR) {
                    if ((jqXHR.status === 401) && (options.loginUrl)) {
                        $modalDialog.ajaxContent({
                            url : options.loginUrl
                        });
                    } else {
                        $modalDialog.error(jqXHR.responseText);
                    }
                }
            }));
        };
        
        $modalDialog.on('submit', 'form', function(event) {
            event.preventDefault();
            var form = this;
            var $form = $(form);
            var method = $form.attr('method').toLowerCase() || 'post';
            var ajax = {
                url : $form.attr('action')
            };
            if (method === 'post') {
                ajax.data = new FormData(form);
                ajax.type = 'post';
                ajax.enctype = 'multipart/form-data';
                ajax.processData = false; // tell jQuery not to process the data
                ajax.contentType = false; // tell jQuery not to set contentType
            } else {
                ajax.data = $form.serialize();
            }
            $modalDialog.ajaxContent(ajax);
            return false;
        });
        return $modalDialog;
    };
})(window.jQuery);

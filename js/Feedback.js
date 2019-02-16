class Feedback {
    constructor(source, container = '#feedback', form = '#myForm') {
        this.source = source;
        this.container = container;
        this.form = form;
        this.comments = []; // Все отзывы
        this.curID = 0;
        this._init();
    }

    _init() {
        this._initForm();
        this._initAddCommentButton();
        fetch(this.source)
            .then(result => result.json())
            .then(data => {
                this.curID = data.maxID;
                for (let comment of data.comments) {
                    this.comments.push(comment);
                    this._renderComment(comment);
                }
            })
    }

    _initAddCommentButton() {
        let $wrapper = $('<div/>', {
            class: 'feedback__comment',
            id: 'newCommentContainer'
        });

        let $buttonSection = $(`<div class="feedback__buttons"></div>`);
        $wrapper.append($buttonSection);

        let $addCommentBtn = $(`<i class="fas fa-plus feedback__button"></i>`);
        $addCommentBtn.click(() => {
            $(this.form).parent().addClass('feedback__visible');
        });

        $buttonSection.append($addCommentBtn);

        $(this.container).append($wrapper);
    }

    _initForm() {
        $(this.form).submit(e => {
            e.preventDefault();

            let $author = $('#author');
            let $text = $('#text');

            if (!$author.val() || !$text.val()) {
                return
            }
            let comment = {
                id: ++this.curID,
                author: $author.val(),
                text: $text.val(),
                approved: false
            };
            this.comments.push(comment);
            this._renderComment(comment);
            this._clearFormFields();
            $(this.form).parent().removeClass('feedback__visible');
        });

        $('#closeFormBtn').on('click', () => {
            this._clearFormFields();
            $(this.form).parent().removeClass('feedback__visible');
        });
    }

    _clearFormFields() {
        $('#author').val('');
        $('#text').val('');
    }

    _renderComment(comment) {
        let $wrapper = $('<div/>', {
            class: 'feedback__comment',
            'data-id': comment.id
        });
        let $author = $(`<h3 class="feedback__author">${comment.author}</h3>`);
        let $text = $(`<p class="feedback__text">${comment.text}</p>`);

        $wrapper.append($author);
        $wrapper.append($text);

        if (!comment.approved) {
            let $buttonSection = $(`<div class="feedback__buttons"></div>`);
            $wrapper.append($buttonSection);

            let $approve = $(`<i class="fas fa-check feedback__button"></i>`);
            $approve.click(() => {
                this._approve(comment.id);
            });

            let $delBtn = $(`<i class="fas fa-times feedback__button"></i>`);
            $delBtn.click(() => {
                this._remove(comment.id);
            });

            $buttonSection.append($approve);
            $buttonSection.append($delBtn);

            $wrapper.addClass('not-approved');
        } else {
            $wrapper.addClass('approved');
        }

        //$(this.container).append($wrapper);
        $wrapper.insertBefore($('#newCommentContainer'))
    }

    _remove(id) {
        let find = this.comments.find(comment => comment.id === id);
        this.comments.splice(this.comments.indexOf(find), 1);
        $(`.feedback__comment[data-id="${id}"]`).remove();
    }

    _approve(id) {
        let find = this.comments.find(comment => comment.id === id);
        $(`.feedback__comment[data-id="${id}"]`)
            .addClass('approved')
            .removeClass('not-approved')
            .find('.feedback__buttons')
            .remove();
        find.approved = true;
    }
}
class Product {
    constructor(id, title, price, mark, img, container = '#products') {
        this.id = id;
        this.title = title;
        this.price = price;
        this.mark = mark;
        this.img = img;
        this.container = container;
        this._render();
    }

    _render() {
        let $wrapper = $('<div/>', {
            class: 'product-item'
        });

        let $productLink = $('<a/>', {
            class: 'product-item__link',
            href: 'singlePage.html'
        });

        let $productTextBox = $('<div/>', {
            class: 'product-item__textBox'
        });

        let $AddToCartContainer = $('<div/>', {
            class: 'add-to-cart'
        });

        $wrapper.append($productLink);
        $productLink.append(`<img class="product-item__img" src="${this.img}" alt="Product photo">`);
        $productLink.append($productTextBox);
        $productTextBox.append(`<p class="product-item__text">${this.title}</p>`);
        $productTextBox.append(`<p class="product-item__price">\$${number_format(this.price,2)}</p>`);

        $wrapper.append($AddToCartContainer);

        let $btnAddToCart = $('<a/>', {
            class: 'add-to-cart__link',
            text: 'Add to cart',
            'data-id': this.id,
            'data-price': this.price,
            'data-name': this.title,
            'data-mark': this.mark
        });
        $AddToCartContainer.append($btnAddToCart);

        $btnAddToCart.append(`<img class="add-to-cart__img" src="img/cart_white.svg" alt="cart-img">`);

        $(this.container).append($wrapper);

        // $wrapper.draggable({
        //     revert: true
        // });
        // $wrapper.draggable({
        //     cancel: "a.ui-icon", // clicking an icon won't initiate dragging
        //     revert: "invalid", // when not dropped, the item will revert back to its initial position
        //     helper: "clone",
        //     cursor: "move"
        // });
    }
}
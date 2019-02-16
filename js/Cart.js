class Cart {
    constructor(source, container = '#cartDropdownBox', type = 'cartMenu') {
        this.source = source;
        this.container = container;
        this.countGoods = 0;
        this.amount = 0;
        this.cartItems = [];
        this.type = type;
        this._init(this.source);
    }

    _init(source) {
        if (this.type === 'cartMenu') {
            this._renderCartMenu();
        } else {
            this._renderCart();
        }
        if (!localStorage.getItem('myCart')) {
            fetch(source)
                .then(result => result.json())
                .then(data => {
                    for (let product of data.contents) {
                        this.cartItems.push(product);
                        if (this.type === 'cartMenu') {
                            this._renderItemCartMenu(product);
                        } else {
                            this._renderItemCart(product);
                        }
                    }
                    this.countGoods = data.countGoods;
                    this.amount = data.amount;
                    this._renderSum();
                    localStorage.setItem('myCart', JSON.stringify(this.cartItems));
                    localStorage.setItem('amount', JSON.stringify(this.amount));
                    localStorage.setItem('countGoods', JSON.stringify(this.countGoods));
                })
        } else {
            this.cartItems = JSON.parse(localStorage.getItem('myCart'));
            for (let product of this.cartItems) {
                if (this.type === 'cartMenu') {
                    this._renderItemCartMenu(product);
                } else {
                    this._renderItemCart(product);
                }
            }
            this.amount = JSON.parse(localStorage.getItem('amount'));
            this.countGoods = JSON.parse(localStorage.getItem('countGoods'));
            this._renderSum();
        }
    }

    _renderCartMenu() {
        let $cartItemsDiv = $('<div/>', {
            class: 'Cart__items-wrap'
        });

        let $menuTotalBox = $('<div/>', {
            class: 'Cart__MenuTotalBox',
        });
        $menuTotalBox.append(`<div class="Cart_MenuTotalText">TOTAL</div>`);
        $menuTotalBox.append(`<div class="Cart_MenuTotalText" id="cartAmount"></div>`);

        $cartItemsDiv.appendTo($(this.container));
        $menuTotalBox.appendTo($(this.container));

        let $btnCheckout = $('<a/>', {
            class: 'Button-Pink-White-Pink-50 Margin_Top32',
            href: 'checkout.html',
            text: 'Checkout'
        });
        $(this.container).append($btnCheckout);

        let $btnGotoCart = $('<a/>', {
            class: 'Button-Black-White-Gray-50 Margin_Top11',
            href: 'shoppingCart.html',
            text: `Go to cart`
        });
        $(this.container).append($btnGotoCart);

        // $(this.container).droppable({
        //     drop: (event, ui) => {
        //         this.addProduct(ui.draggable.find('.buyBtn'));
        //     }
        // })

    }

    _renderCart() {
        let $container = $(this.container);

        let $catalogHeader = $(`<div class="CartCatalog__Header">`);

        $container.append($catalogHeader);
        $catalogHeader.append(`<div class="CartCatalog__HeaderTitle CartCatalog__Column1">Product Details</div>`);
        $catalogHeader.append(`<div class="CartCatalog__HeaderTitle CartCatalog__Column2">unite Price</div>`);
        $catalogHeader.append(`<div class="CartCatalog__HeaderTitle CartCatalog__Column3">Quantity</div>`);
        $catalogHeader.append(`<div class="CartCatalog__HeaderTitle CartCatalog__Column4">shipping</div>`);
        $catalogHeader.append(`<div class="CartCatalog__HeaderTitle CartCatalog__Column5">Subtotal</div>`);
        $catalogHeader.append(`<div class="CartCatalog__HeaderTitle CartCatalog__Column6">ACTION</div>`);
        $container.append(`<div class="CartCatalog__SplitLine"></div>`);

        let $cartItemsDiv = $('<div/>', {
            class: 'CartCatalog__items'
        });

        $cartItemsDiv.appendTo($(this.container));

        $('#clearCartBtn').click(() => {
            this._removeAllProducts();
        })
    }

    _renderItemCartMenu(product) {
        let $container = $('<div/>', {
            class: 'Cart__Item',
            'data-product': product.id_product
        });

        let $productBox = $('<div/>', {
            class: 'Cart__ProductBox',
        });

        let $productItem = $('<a/>', {
            class: 'CartMenuProduct',
            href: 'singlePage.html',
        });

        let $cartMenuProductTextBox = $('<div/>', {
            class: 'CartMenuProduct__TextBox',
        });

        //mark stars
        let $productMark = $('<div/>', {
            class: 'CartMenuProduct__ProductMark',
        });
        for (let i = 1; i <= 5; i++) {
            let $star = '';

            if (product.mark >= i) {
                $star = $(`<i class="fas fa-star"></i>`);
            } else if (product.mark > i && product.mark < i + 1) {
                $star = $(`<i class="fas fa-star-half-alt"></i>`);
            } else {
                $star = $(`<i class="far fa-star"></i>`);
            }

            $productMark.append($star);
        }

        let $removeBtn = $('<div/>', {
            class: 'Cart__DeleteItem',
            'data-id': product.id_product,
        });
        $removeBtn.click(() => {
            this._removeProduct(product.id_product);
        });

        $container.append($productBox);
        $productBox.append($productItem);
        $productItem.append($(`<img class="CartMenuProduct__img" src="img/Item_${product.id_product}.png" alt="Product photo">`));
        $productItem.append($cartMenuProductTextBox);
        $cartMenuProductTextBox.append(`<div class="CartMenuProduct__ProductName">${product.product_name}</div>`);
        $cartMenuProductTextBox.append($productMark);
        $cartMenuProductTextBox.append(`<div class="CartMenuProduct__ProductPrice">${product.quantity} x \$${number_format(product.price, 2)}</div>`);
        $productBox.append($removeBtn);
        $removeBtn.append(`<i class="fas fa-times-circle"></i>`);
        $container.append(`<div class="SplitHorizontalLine Margin_Top16 Margin_Bottom16"></div>`);

        $container.appendTo($('.Cart__items-wrap'));
    }

    _renderItemCart(product) {
        let $container = $('<div/>', {
            class: 'Cart__Item',
            'data-product': product.id_product
        });

        let $cartCatalogItem = $(`<div class="CartCatalog-item"></div>`);
        let $cartCatalogPhoto = $(`<div class="CartCatalog-photo"></div>`);
        let $cartCatalogItemTextBox = $(`<div class="CartCatalog-item__textBox"></div>`);
        let $cartCatalogItemColumn3 = $(`<div class="CartCatalog-item__Column3"></div>`);

        let $inputAmount = $('<input/>', {
            class: 'CartCatalog-item__InputStyle',
            type: 'text',
            placeholder: '1',
            'data-id': product.id_product,
        });
        $inputAmount.change(event => {
            let productId = +$(event.currentTarget).data('id');
            let find = this.cartItems.find(product => product.id_product === productId);
            find.quantity = +event.currentTarget.value;

            this._calculateTotals();
            this._updateCart(find);
            this._renderSum();
        });

        $container.append($cartCatalogItem);
        $cartCatalogItem.append($cartCatalogPhoto);
        $cartCatalogPhoto.append(`<img class="CartCatalog-item__img" src="img/Item_${product.id_product}.png" alt="Product photo">`);
        $cartCatalogItem.append($cartCatalogItemTextBox);
        $cartCatalogItemTextBox.append(`<a class="CartCatalog-item__ProductName" href="singlePage.html">${product.product_name}</a>`);
        $cartCatalogItemTextBox.append(`<div class="CartCatalog-item__ProductProperties">` +
            `<div class="CartCatalog-item__ProductProperty">Color: <span class="CartCatalog-item__ProductPropertyValue">Red</span></div>` +
            `<div class="CartCatalog-item__ProductProperty">Size: <span class="CartCatalog-item__ProductPropertyValue">Xll</span></div>` +
            `</div>`);
        $cartCatalogItem.append(`<div class="CartCatalog-item__TextStyle CartCatalog-item__Column2">\$${product.price}</div>`);
        $cartCatalogItem.append($cartCatalogItemColumn3);
        $cartCatalogItemColumn3.append($inputAmount);
        $cartCatalogItem.append(`<div class="CartCatalog-item__TextStyle CartCatalog-item__Column4">FREE</div>`);
        $cartCatalogItem.append(`<div class="CartCatalog-item__TextStyle CartCatalog-item__Column5">\$${product.quantity * product.price}</div>`);

        let $cartCatalogItemColumnAction = $(`<div class="CartCatalog-item__action CartCatalog-item__Column6"></div>`);
        $cartCatalogItem.append($cartCatalogItemColumnAction);
        let $removeBtn = $('<i/>', {
            class: 'fas fa-times-circle',
            'data-id': product.id_product,
        });
        $removeBtn.click(() => {
            this._removeProduct(product.id_product);
        });
        $cartCatalogItemColumnAction.append($removeBtn);

        $container.append(`<div class="CartCatalog__SplitLine"></div>`);

        $container.appendTo($('.CartCatalog__items'));
    }

    _calculateTotals() {
        this.countGoods = 0;
        this.amount = 0;
        for (let product of this.cartItems) {
            this.countGoods += product.quantity;
            this.amount += product.quantity * product.price;
        }
    }

    _renderSum() {
        $('#cartAmount').text(`\$${number_format(this.amount, 2)}`);

        let $countGoods = $('#countGoods');

        $countGoods.text(`${this.countGoods}`);
        if(this.countGoods === 0) {
            $countGoods.addClass('invisible')
        } else {
            $countGoods.removeClass('invisible')
        }

        if (this.type === 'cart') {
            $('#cartSubAmount').text(`\$${number_format(this.amount, 2)}`)
        }
    }

    _updateCart(product) {
        let $container = $(`div[data-product=${product.id_product}]`);
        if (this.type === 'cartMenu') {
            $container.find('.CartMenuProduct__ProductPrice').text(`${product.quantity} x \$${number_format(product.price, 2)}`);
        } else {
            $container.find('.CartCatalog-item__InputStyle').val(`${product.quantity}`);
            $container.find('.CartCatalog-item__Column5').text(`\$${number_format(product.price * product.quantity, 2)}`);
        }
    }

    addProduct(element) {
        let productId = +$(element).data('id');
        let find = this.cartItems.find(product => product.id_product === productId);
        if (find) {
            find.quantity++;
            this.countGoods++;
            this.amount += find.price;
            this._updateCart(find);
        } else {
            let product = {
                id_product: productId,
                product_name: $(element).data('name'),
                mark: $(element).data('mark'),
                price: +$(element).data('price'),
                quantity: 1
            };
            this.cartItems.push(product);
            this.amount += product.price;
            this.countGoods += product.quantity;
            this._renderItemCartMenu(product);
        }
        localStorage.setItem('myCart', JSON.stringify(this.cartItems));
        localStorage.setItem('amount', JSON.stringify(this.amount));
        localStorage.setItem('countGoods', JSON.stringify(this.countGoods));
        this._renderSum();
    }

    _removeProduct(productId) {
        let find = this.cartItems.find(product => product.id_product === productId);
        if (find) {
            find.quantity--;
            this.countGoods--;
            this.amount -= find.price;

            if (find.quantity === 0) {
                this.cartItems.splice(this.cartItems.indexOf(find), 1);
                let $container = $(`div[data-product=${productId}]`);
                $container.remove();
            } else {
                this._updateCart(find);
            }
        }
        localStorage.setItem('myCart', JSON.stringify(this.cartItems));
        localStorage.setItem('amount', JSON.stringify(this.amount));
        localStorage.setItem('countGoods', JSON.stringify(this.countGoods));
        this._renderSum();
    }

    _removeAllProducts() {
        while (this.cartItems.length > 0) {
            let productId = this.cartItems[0].id_product;
            this._removeProduct(productId);
        }
    }
}
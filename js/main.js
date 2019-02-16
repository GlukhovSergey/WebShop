function initProducts(cart, productsListJson) {
    fetch(productsListJson)
        .then(result => result.json())
        .then(data => {
            for (let product of data) {
                const el = new Product(product.id, product.name, product.price, product.mark, `img/Item_${product.id}.png`);
            }

            $('.add-to-cart__link').click(e => {
                cart.addProduct(e.currentTarget);
            });

        });
}

function initPage_index() {
    //анимация надписи баннера
    $('.banner__h3_notLoaded').removeClass('banner__h3_notLoaded');
    $('.banner__h4_notLoaded').removeClass('banner__h4_notLoaded');
}

function initPage_product() {
    //slider
    $(function () {
        let $amount1 = $("#amount1");
        let $amount2 = $("#amount2");
        let $sliderRange = $("#slider-range");

        $sliderRange.slider({
            range: true,
            min: 0,
            max: 1000,
            values: [100, 400],
            slide: function (event, ui) {
                $amount1.text("$" + ui.values[0]);
                $amount2.text("$" + ui.values[1]);
            }
        });
        $amount1.text("$" + $sliderRange.slider("values", 0));
        $amount2.text("$" + $sliderRange.slider("values", 1));
    });

    //accordion
    // $( function() {
    //     $( "#accordion" ).accordion({
    //         collapsible: true
    //     });
    // } );
}

function initPage_checkout() {
    $('.CheckoutMainSection__Title').on('click', e => {
        e.preventDefault();
        $el = $(e.target).next();
        if ($el.hasClass('CheckoutOrderDetailsBlock_invisible')) {
            $el.removeClass('CheckoutOrderDetailsBlock_invisible');
        } else {
            $el.addClass('CheckoutOrderDetailsBlock_invisible');
        }
    })
}


$(document).ready(() => {

    let pathname = document.location.pathname;
    let pageName = pathname.match(/\w+.html/i)[0];

    let cart = '';
    let productsListJson = '';

    //инициализация корзины
    switch (pageName) {
        case 'index.html':
        case 'product.html':
        case 'singlePage.html':
        case 'checkout.html':
            cart = new Cart('json/getCart.json');
            break;
        case 'shoppingCart.html':
            cart = new Cart('json/getCartPageShoppingCart.json', '#cartBox', 'cart');
            break;
    }

    //инииализация товаров на странице
    switch (pageName) {
        case 'index.html':
            productsListJson = 'json/getProducts.json';
            initProducts(cart, productsListJson);
            break;
        case 'product.html':
            productsListJson = 'json/getProductsPageProducts.json';
            initProducts(cart, productsListJson);
            break;
        case 'singlePage.html':
            productsListJson = 'json/getProductsSinglePage.json';
            initProducts(cart, productsListJson);
            break;
    }

    //индивидуальная инициализация страниц
    switch (pageName) {
        case 'index.html':
            initPage_index();
            break;
        case 'product.html':
            initPage_product();
            break;
        case 'singlePage.html':
            let feedback = new Feedback('json/feedback.json');
            break;
        case 'checkout.html':
            initPage_checkout();
            break;
    }


    // $('#cart').droppable({
    //     drop: function (event, ui) {
    //         cart.addProduct(ui.draggable.find('.buyBtn'));
    //     }
    // });

});

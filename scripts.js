// ------------------------------------------------------------------------------------------------------
// ON LOAD
// ------------------------------------------------------------------------------------------------------

document.onload = setup_bg_imgs();
document.onload = update_products_number(get_all_products().length)

// ------------------------------------------------------------------------------------------------------
// CONSTANTS
// ------------------------------------------------------------------------------------------------------

var basket_state = 0;
var displayed_products = 0;
var easters = coconut = richman = grappe = 0;

// ------------------------------------------------------------------------------------------------------
// AUTOMATICALY SETUP FRUITS IMAGES
// ------------------------------------------------------------------------------------------------------

function setup_bg_imgs() {
    var fields = document.getElementsByClassName('set-bg');
    for (let item of fields) {
        item.style.backgroundImage = "url('img/" + item.id + ".jpg')";
    }
}

// ------------------------------------------------------------------------------------------------------
// GENERAL FUNCTIONS
// ------------------------------------------------------------------------------------------------------

function get_parent_id(item) {
    id = item.parentNode.parentNode.parentNode.id;
    return (id);
}

// ------------------------------------------------------------------------------------------------------
// GET INFORMATIONS FUNCTIONS
// ------------------------------------------------------------------------------------------------------

function get_product_price(produit) {
    price = document.getElementById(produit).parentNode.childNodes[3].childNodes[3].innerHTML;
    price = price.replace("€", ".")
    return (parseFloat(price));
}

function get_product_current_quantity(produit) {
    quantity = document.getElementById(produit).getElementsByClassName("quantity")[0].innerHTML;
    return (quantity);
}

function get_basket_amount() {
    var amount = document.getElementById('prices').innerHTML.split("€")[0];
    return (parseFloat(amount));
}

function get_basket_products() {
    var products = document.getElementById('prices').innerHTML.split("(")[1].split(" ")[0];
    return (parseFloat(products));
}

// ------------------------------------------------------------------------------------------------------
// BASKET MANAGING
// ------------------------------------------------------------------------------------------------------

function product_empty_basket(produit) {
    element = document.getElementById(produit);
    element.getElementsByClassName("fa-cart-plus")[0].style.display = 'block';
    element.getElementsByClassName("fa-trash-can")[0].style.display = 'none';
    element.getElementsByClassName("fa-circle-minus")[0].style.display = 'none';
    element.getElementsByClassName("fa-circle-plus")[0].style.display = 'none';
    element.getElementsByClassName("quantity")[0].style.display = 'none';
}

function product_not_empty_basket(produit) {
    element = document.getElementById(produit);
    element.getElementsByClassName("fa-cart-plus")[0].style.display = 'none';
    element.getElementsByClassName("fa-trash-can")[0].style.display = 'block';
    element.getElementsByClassName("fa-circle-minus")[0].style.display = 'block';
    element.getElementsByClassName("fa-circle-plus")[0].style.display = 'block';
    element.getElementsByClassName("quantity")[0].style.display = 'inline';
}

function updateBasket(action, amount, quantite = 0) {
    var montant = parseFloat(get_basket_amount());
    var produits = parseFloat(get_basket_products());

    if (action == "delete") {
        somme_avant = quantite * amount;
        montant = montant - somme_avant;
        produits = produits - quantite;
    }
    else if (action == "add") {
        montant = montant + parseFloat(amount);
        produits++;
    } else {
        montant = montant - parseFloat(amount);
        produits--;
    }

    prices.innerHTML = montant.toFixed(2) + " € (" + produits + " produits)";

}

function displayBasket(display) {
    if (display == true) {
        document.getElementById('panier').style.display = 'block';
        document.getElementById('panier_empty').style.display = 'none';
        basket_state = 1;
        shopping_icons = document.getElementById('panier').getElementsByClassName("fa-bag-shopping")[0];
        shopping_icons.classList.add('fa-bounce');
        setTimeout(() => { shopping_icons.classList.remove('fa-bounce'); }, 2000);
    } else {
        document.getElementById('panier').style.display = 'none';
        document.getElementById('panier_empty').style.display = 'block';
        basket_state = 0;
    }
}

// ------------------------------------------------------------------------------------------------------
// ACTIONS WITH PRODUCTS
// ------------------------------------------------------------------------------------------------------

function update_product_quantity(produit, quantity) {
    document.getElementById(produit).getElementsByClassName("quantity")[0].innerHTML = quantity;
}

function updateProductInBasket(produit) {
    quantity = get_product_current_quantity(produit);
    prix = get_product_price(produit);
    somme = quantity * prix;

    articles = document.getElementById('articles').getElementsByClassName(produit);
    for (let i = 0; i < articles.length; i++) {
        article = articles[i];
        if (article.className == produit) {
            article.remove();
        }
    }
    if (quantity > 0) {
        document.getElementById('articles').innerHTML += `
        <div class="`+ produit + `">
            `+ produit + ` x ` + quantity + ` = ` + somme + ` €
        </div>
        `;
    }

}

function product_action(item) {
    product = get_parent_id(item);
    action = item.className;

    element = document.getElementById(product);
    prix = get_product_price(product);

    current_quantity = parseFloat(get_product_current_quantity(product));


    if (action == "fa fa-cart-plus") {
        product_not_empty_basket(product);
        updateBasket("add", prix);
    } else if (action == "fa fa-trash-can") {
        product_empty_basket(product);
        updateBasket("delete", prix, current_quantity);
        update_product_quantity(product, 0)
    } else if (action == "fa fa-circle-plus") {
        quantity = current_quantity + 1;
        update_product_quantity(product, quantity);
        updateBasket("add", prix);
    } else if (action == "fa fa-circle-minus") {
        if (quantity > 1) {
            quantity = current_quantity - 1;
            update_product_quantity(product, quantity);
            updateBasket("remove", prix);
        } else {
            quantity = 1;
            update_product_quantity(product, quantity);
        }
    }
    updateProductInBasket(product);
    if (basket_state == 0) {
        shopping_icons = document.getElementById('panier_empty').getElementsByClassName("fa-bag-shopping")[0];
        shopping_icons.classList.add('fa-shake');
        setTimeout(() => { shopping_icons.classList.remove('fa-shake'); }, 5000);
    }

    coconuts(product, quantity);
    supercart();
}

// ------------------------------------------------------------------------------------------------------
// RESEARCH
// ------------------------------------------------------------------------------------------------------

function update_products_number(value) {
    document.getElementById('articles_number').innerHTML = value;
    if (value == 0) {
        document.getElementsByClassName('no_product')[0].style.display = "inline";
        document.getElementById('filter').style.color = 'red';
    } else {
        document.getElementsByClassName('no_product')[0].style.display = "none";
        document.getElementById('filter').style.color = 'rgb(86,178,0)';
    }
}

function get_all_products() {
    var elements = document.getElementsByClassName('products')[0].getElementsByClassName("featured__item__text");
    return elements;
}

function recherche(entree) {
    elements = get_all_products();
    displayed_products = elements.length;
    for (let i = 0; i < elements.length; i++) {
        var fruit = elements[i].parentNode.childNodes[1].id;
        elements[i].parentNode.parentNode.style.display = 'block';
    }
    if (entree.value.length > 0) {
        for (let i = 0; i < elements.length; i++) {
            var fruit = elements[i].parentNode.childNodes[1].id;
            var description = elements[i].childNodes[1].innerHTML.toUpperCase();
            if (description.indexOf(entree.value.toUpperCase()) < 0) {
                elements[i].parentNode.parentNode.style.display = 'none';
                displayed_products--;
            }
        }
    }
    update_products_number(displayed_products);
}

function selectCategorie(objet) {
    console.log(objet)
    console.log(objet.textContent)
    elements = document.getElementsByClassName('col-lg-3');
    for (let index = 0; index < elements.length; index++) {
        if (!elements[index].classList.value.includes(objet.textContent)) {
            elements[index].style.display = 'none';
        } else {
            elements[index].style.display = 'block';
        }
    }

}


// ------------------------------------------------------------------------------------------------------
// THIS IS TOTALLY USELESS, BUT SO FUNNY
// ------------------------------------------------------------------------------------------------------

function coconuts(product, quantity) {
    if (product == 'coco' && quantity == 10) {
        document.getElementById('uselessbutfunny').style.display = 'block';
        setTimeout(() => { document.getElementById('uselessbutfunny').style.display = 'none'; }, 5000);
        coconut = 1;
    }
    else if (product == 'raisin' && quantity == 5) {
        document.getElementById('uselessbutfunny3').style.display = 'block';
        setTimeout(() => { document.getElementById('uselessbutfunny3').style.display = 'none'; }, 3000);
        grappe = 1;
    }
    get_easter_eggs();
}

function supercart() {
    basket = get_basket_amount();
    if (basket > 1000) {
        document.getElementById('uselessbutfunny2').style.display = 'block';
        setTimeout(() => { document.getElementById('uselessbutfunny2').style.display = 'none'; }, 5000);
        richman = 1;
    }
    get_easter_eggs();
}

function get_easter_eggs() {
    if (easters != coconut + richman + grappe) {
        scroll(0, 0);
    }
    easters = coconut + richman + grappe;
    easter_element = document.getElementById('easter_eggs');
    if (easters > 0) {
        easter_element.style.display = 'block';
        easter_element.getElementsByClassName('easter_value')[0].innerHTML = easters;
    }
}
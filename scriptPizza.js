let cart = [];
let modalQt = 1;
let modalKey = 0;

// O comando abaixo estou criando uma funcao e substituindo
// fica simplificado
// 1 PARTE
const funcao = (el)=>{
    return document.querySelector(el)
}

const funcoes = (el)=>{
    return document.querySelectorAll(el)
}

        // PODEMOS REDUZIR MAIS O CODIGO CONFORME ABAIXO
        // 2 PARTE
        // const funcao = (el)=>document.querySelector(el)


                // 3 PARTE  COM O QUERYSELECTORALL
                // const funcao = (el)=>document.querySelectorAll(el)

// 1.1 PARTE
// pizzaJson.map((item, index)=>{
//     let pizzaItem = document.querySelector(".models .pizza-item").cloneNode(true);
//         //preencher as informacoes em pizzaitem
//         document.querySelector(".pizza-area").append( pizzaItem)
// });


        // 1.2 SEGUNDA PARTE LISTA DAS PIZZAS
        pizzaJson.map((item, index)=>{
            let pizzaItem = funcao(".models .pizza-item").cloneNode(true);
            //Gravando o id de cada pizza quando clicar
            pizzaItem.setAttribute('data-key', index)

            //preencher as informacoes em pizzaitem
            pizzaItem.querySelector(".pizza-item--img img").src = item.img
            pizzaItem.querySelector(".pizza-item--price").innerHTML = `R$ ${item.price.toFixed(2)}`
            pizzaItem.querySelector(".pizza-item--name").innerHTML = item.name
            pizzaItem.querySelector(".pizza-item--desc").innerHTML = item.description
            // Eliminando a ação da tag a
            pizzaItem.querySelector(".pizza-item a").addEventListener('click',(e)=>{
                e.preventDefault()
                //armazena o id de cada piiza na variavel key
                // o closest ele pega a class mais proxima que colocar dentro 
                // dos parentes
                let key = e.target.closest(".pizza-item").getAttribute("data-key")
                modalQt = 1;
                modalKey = key;

                funcao(".pizzaInfo h1").innerHTML = pizzaJson[key].name
                funcao(".pizzaInfo--desc").innerHTML = pizzaJson[key].description
                funcao(".pizzaBig img").src = pizzaJson[key].img
                funcao(".pizzaInfo--actualPrice").innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}` 
                //Tirando o selected da pizza
                funcao(".pizzaInfo--size.selected").classList.remove('selected');

                funcoes(".pizzaInfo--size").forEach((size, sizeIndex)=>{
                    if(sizeIndex == 2){
                        size.classList.add('selected');
                    }

                    size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
                });

                funcao('.pizzaInfo--qt').innerHTML = modalQt;

                //ANIMAÇAO DO MODAL QUANDO CLICA NO a OU NA img
                funcao(".pizzaWindowArea").style.opacity = 0
                funcao('.pizzaWindowArea').style.display = "flex"
                setTimeout(()=>{
                    funcao(".pizzaWindowArea").style.opacity = 1
                }, 300)               
                
            })  

            funcao(".pizza-area").append( pizzaItem)
        });
        

        //EVENTOS DO MODAL


        function closeModal() {
           funcao('.pizzaWindowArea').style.opacity = 0;
           setTimeout(()=>{
                funcao('.pizzaWindowArea').style.display = 'none';
           }, 500) 
        }
        funcoes('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{
            item.addEventListener('click', closeModal)
        })
        // Botão Mais
        funcao('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
            if(modalQt > 1){
                modalQt--;
                funcao('.pizzaInfo--qt').innerHTML = modalQt;
            }
           
        });
        //Botão Meno
        funcao('.pizzaInfo--qtmais').addEventListener('click', ()=>{
            modalQt++;
            funcao('.pizzaInfo--qt').innerHTML = modalQt;

        });
        // Selecionar os Tamanhos
        funcoes(".pizzaInfo--size").forEach((size, sizeIndex)=>{
            size.addEventListener('click', (e)=>{
                funcao(".pizzaInfo--size.selected").classList.remove('selected');
                size.classList.add('selected');
            });
        });
        // Adicionar Carrinho criei uma let para armazenar as informacoes do carrinho
        funcao('.pizzaInfo--addButton').addEventListener('click', ()=>{
            // Qual a pizza?
            //Qual o tamanho?
             //Quantas pizzas?
            let size = parseInt(funcao(".pizzaInfo--size.selected").getAttribute('data-key'));

            let identifier = pizzaJson[modalKey].id+'@'+size;

            let key = cart.findIndex((item)=>item.identifier == identifier);
            
            if(key > -1) {
                cart[key].qt += modalQt;
            } else {
                cart.push({
                    identifier,
                    id:pizzaJson[modalKey].id,
                    size,
                    qt:modalQt
                });
            }
             updateCart();
             closeModal();
        });

        //  funcao btn Mobile
          funcao('.menu-openner').addEventListener('click', ()=> {
            if(cart.length > 0) {
                funcao('aside').style.left = '0';
            }
        });

        // funcao fechar Mobile
        funcao('.menu-closer').addEventListener('click', ()=> {
            funcao('aside').style.left = '100vw';
        });



        // Carrinho Atualizar 
        function updateCart() {

            // Carrinho Mobile
            funcao('.menu-openner span').innerHTML = cart.length;
            // Carrinho Mobile

            if(cart.length > 0) {
                funcao('aside').classList.add('show');
                // Zera e mostrar
                funcao('.cart').innerHTML = '';

                let subtotal = 0;
                let desconto = 0;
                let total = 0;

                //Colocar as informações dentro do carrinho
                for(let i in cart) {
                    let pizzaItem = pizzaJson.find((item)=>item.id == cart[i].id);
                    subtotal += pizzaItem.price * cart[i].qt;

                    let cartItem = funcao('.models .cart--item').cloneNode(true);

                    let pizzaSizeName;
                    switch(cart[i].size) {
                        case 0:
                            pizzaSizeName = 'P';
                            break;
                        case 1:
                            pizzaSizeName = 'M';
                            break;
                        case 2:
                            pizzaSizeName = 'G';
                            break;
                    }

                    let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

                    //adicionando as informacoes no carrinho
                    cartItem.querySelector('img').src = pizzaItem.img;
                    cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
                    cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;

                    cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
                        if(cart[i].qt >1){
                            cart[i].qt--;
                        } else {
                            cart.splice(i, 1);
                        }                        
                        updateCart();
                    });

                    cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
                        cart[i].qt++;
                        updateCart();
                    });

                    funcao('.cart').append(cartItem);
                        
                    }

                    desconto = subtotal * 0.1;
                    total = subtotal - desconto;

                    funcao('.subtotal span:last-child').innerHTML = ` R$ ${subtotal.toFixed(2)}`;
                    funcao('.desconto span:last-child').innerHTML = ` R$ ${desconto.toFixed(2)}`;
                    funcao('.total span:last-child').innerHTML = ` R$ ${total.toFixed(2)}`;

                
            } else {
                funcao('aside').classList.remove('show');
                funcao('aside').style.left = '100vw';
            }
        }
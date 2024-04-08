const getTypeColor=type=>{
    const normal =' #F5F5F5'
    return {
        fire:'#FDDFDF',
        grass:"#DEFDE0",
        eletric:"#FCF7DE",
        ice:"#DEF3FD",
        water:"#DEF3FD",
        ground:"#F4E7DA",
        rock:'#D5D5D4',
        fairy:'#FCEAFF',
        poison:'#98D7A5',
        bug:'#F8D5A3',
        ghost:'#CAC0f7',
        dragon:'#97B3E6',
        psychic:'#EAEDA1',
        fighting:'#E6E0D4'
    }[type]||normal
}


const getOnlyFulfilled=async({func, arr})=>{
    const promises = arr.map(func)//result=> fetch(result.url)
    const porckets = await Promise.allSettled(promises)
    return  porckets.filter(response=>response.status=='fulfilled')

}
const getPokemonType = async pokApiresult =>{
    const fulfilled = await getOnlyFulfilled({arr:pokApiresult, func:result=>fetch(result.url)})
    const promisesUrl= fulfilled.map(url=>url.value.json())
    const porkemons = await Promise.all(promisesUrl)
    return porkemons.map(fulfilled=>fulfilled.types.map(info =>info.type.name))
}


const getPokemonId= pokApiresult=>pokApiresult.map(({url})=>{
    const urlAsArray= url.split('/')
    return urlAsArray.at(urlAsArray.length-2)
})


const handlePageloade= async urlapi=>{
    try{
        const response = await fetch(`${urlapi}`)
       

        if(!response.ok){
            console.log('não foi possivel obter as informações')
        }
       
        const { results: pokApiresult } = await response.json()
        console.log(pokApiresult)
        
        pegarUrl(pokApiresult)
        const types= await getPokemonType(pokApiresult)
        console.log('por que não?')
        console.log(types)
        const ids =getPokemonId(pokApiresult)
       
        console.log(ids)
     
    }
    catch(error){
           console.log('error',error)
    }
}
 const url='https://pokeapi.co/api/v2/pokemon?limit=15&offset=0'

handlePageloade(url)

// const idsd = [1,2,3,5,6,]


// const fetchImgs = async ids =>{
//     try{
        
//         const imgid= await ids.map(id=> fetch(`testeimg/${id}.png`))
//         const respondido = await Promise.allSettled(imgid)
//        const imgs = respondido.filter(respond=>respond.status=='fulfilled')
//       const resultimg= imgs.map(responsigm=>responsigm.value.url)
//       console.log(resultimg)
//     }
//     catch(erro){
//         console.log(erro)
//     }
// }

// fetchImgs(idsd)

const pegarUrl = async urimg=>{

    const pokemons = document.querySelector('.pokemons')
    const vertipo= await getPokemonType(urimg)
    console.log(vertipo)
   
     console.log( urimg.map(result=>fetch(result.url)))
    console.log(urimg)
    
    
    urimg.forEach((itemsurl)=>{
        console.log(itemsurl)
      

        let urlss= itemsurl.url.split('/')
        const resulturl=urlss.at(urlss.length-2)
    
       
        const li = document.createElement('li')
        const spanquantiti = document.createElement('span')
        spanquantiti.setAttribute('class','spanquantiti')
        const nameUpercase=itemsurl.name.charAt(0).toUpperCase()+ itemsurl.name.substring(1)
        fetch(itemsurl.url)
        .then(response=>response.json())
        .then(data=> {
         const namecolor=data.types[0].type.name
         console.log(namecolor)
         console.log(getTypeColor(namecolor))
         li.style.backgroundColor= getTypeColor(namecolor)
         })
        .catch(error=>console.log(error))
         
        
         
        li.innerHTML=`<span>${nameUpercase}</span>`
        const img= document.createElement('img')
        img.setAttribute('src',`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${resulturl}.png`)
        img.setAttribute('alt','imagem não encontrada')
        img.setAttribute('class','imgitem')
        li.appendChild(img)
        spanquantiti.innerText=resulturl
        li.appendChild(spanquantiti)
        pokemons.appendChild(li)
        
        
     }
        )
        updatePokemons(pokemons.lastChild)

}

const updatePokemons= (poke)=>{
      const novurl='https://pokeapi.co/api/v2/pokemon?limit=15&offset=15'
    const item = new IntersectionObserver((entries,observe)=>{
        console.log(entries)
        console.log(entries[0].isIntersecting)
        if(entries[0].isIntersecting){
            console.log('ok meu patrão')
            handlePageloade(novurl)
            
        }
        console.log(poke)
        observe.unobserve(poke)
    })

    item.observe(poke)
}
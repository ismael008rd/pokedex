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

const pokemons = document.querySelector('.pokemons')

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
       
      
     
    }
    catch(error){
           console.log('error',error)
    }
}
 const url='https://pokeapi.co/api/v2/pokemon?limit=15&offset=0'

handlePageloade(url)



const pegarUrl = async urimg=>{


    const vertipo= await getPokemonType(urimg)
   
    const fragment = new DocumentFragment()
    
    
    urimg.forEach((itemsurl)=>{
        
      

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
         
         li.style.border=` 5px solid ${getTypeColor(namecolor)}`
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
        fragment.appendChild(li)
        pokemons.appendChild(fragment)
        
        
     }
        )
       
        updatePokemons(pokemons.lastChild)
}


let offset=15
let limit =15
const updatePokemons= (poke)=>{
    
      const novurl=`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
    const item = new IntersectionObserver((entries,observer)=>{
        console.log(entries)
          
        const intercedeu=entries[0].isIntersecting
        if(!intercedeu){
           console.log('não interceud')
           return
            
        }
        
        
        console.log('ok meu patrão')
        console.log(entries.target)
            observer.unobserve(poke)
            if(offset==150){
                console.log('ja era seu engraçadinho desobservado')
               return 
            }
            handlePageloade(novurl)

            console.log('desobservou')
            offset+=limit
            console.log(offset)
           
        
    })

    item.observe(poke)
    // item.unobserve(poke)
   
}


import axios from 'axios'
import UIkit from 'uikit'
import {normalisedData} from '../../utils/formattingMethods'
import { Action } from 'rxjs/internal/scheduler/Action';

const CREATE = 'ecommerce/products/CREATE'
const FETCH_SUCCESS = 'ecommerce/products/FETCH_SUCCESS'
const SET = 'ecommerce/products/SET'

const initialState = {
    total: 0,
    product: {},
    items: {}
}

export default function reducer(state = initialState, action){
    switch (action.type){

        case SET:
            const { payload: product } = action
            return {...state, product}

        case CREATE:
            let {items} = state;
            items = {...items, [action.payload.id]: action.payload}
            return {...state, items}

        case FETCH_SUCCESS:
            const products = normalisedData(action.payload)
            return { ...state, items: products }

        case EDIT:
            let { items: newItems } = state
            newItems = { ...newItems, [action.payload.id]: action.payload }
            return { ...state, items: newItems }

        default:
            return state;
    }
}


export const createProduct = (payload) => ({
    type: CREATE,
    payload
})

export const fetchSuccessProducts = (payload) => ({
    type: FETCH_SUCCESS,
    payload
})

export const editProduct = (payload) => ({
    type: SET,
    payload
})

export const onSetProduct = product => dispatch => {
    dispatch(setProduct(product))
}

export const onEditProduct = product => dispatch => {
    axios.patch('', product)
        .then(res => {
            const { data: product } = res
            UIkit.notification({
                message: '<span uk-icon=\'icon: check\'></span> Producto Editado',
                status: 'success',
                pos: 'top-right',
                timeout: 2000
            })
            dispatch(editProduct(product))
        })
}

export const onFetch = () => (dispatch) => { // send variables to filter before the dispatch here
    axios.get('http://localhost:3000/products')
        .then(res=>{
            const {data: products} = res
            dispatch(fetchSuccessProducts(products))
        })
        .catch(e=>console.log(e))
}

export const onCreateProduct = (prod) => (dispatch) => {
    // const id  = Math.floor(Math.random() * 200) + 1   NOT NEEDED CAUSE JSON SERVER CREATES ID
    // const product = {...prod, id}  NOT NEEDED CAUSE ID IS NOT APART, SO THE PRODUCT IS PASSED ON AS IS.
    axios.post("http://localhost:3000/products", prod)
        .then(res => {
            const {data: product} = res
            UIkit.notification({
                message: '<span uk-icon=\'icon: check\'></span> Producto Creado',
                status: 'success',
                pos: 'top-right',
                timeout: 2000
            })
            dispatch(createProduct(product)) 
        })
        .catch(e=>console.log(e))
}
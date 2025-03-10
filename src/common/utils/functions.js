const { default: axios } = require("axios")

require("dotenv").config()

const isTrue = (value) => ['true', 1, true].includes(value)
const isFalse = (value) => ['false', 0, false].includes(value)
const getAddressDetail = async (lat , lng) => {
    const result = await axios(`${process.env.MAP_IR_URL}?lat=${lat}&lon=${lng}` , {
        headers: {
            "x-api-key" : process.env.MAP_API_KEY
        }
    }).then(res => res.data)
    const { city, region, province, address} = result
    return {
        city,
        region,
        province,
        address
    }
}
const removePropOfObject = (target={}, properties = []) => {

    for (const prop of properties) {
        delete target[prop]
    }
    return target

}

module.exports = {
    isTrue,
    isFalse,
    getAddressDetail,
    removePropOfObject
}
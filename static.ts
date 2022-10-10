export const checkExpirationDateJwt = (token: string): boolean => {
    // get the object part that content the expiration Date from token
    const base64Url = token.split('.')[1]
    if (!base64Url) return true;

    // get the payload from the object part 
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    
    if (!base64) return true;

    // decode the payload
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    }).join(''))

    if (!jsonPayload) return true;

    // parse the json object 
    const objToken = JSON.parse(jsonPayload);

    if (!objToken || !objToken.exp) return true;

    // get the expiration date from the payload 
    const expireDate = objToken.exp * 1000;

    if (!expireDate || typeof(expireDate) !== 'number') return true;
    
    // get date now
    const currentDate = Date.now();
    
    // if the expiration date is less than the date now return true else false
    if ((currentDate - 1000 * 60 * 2 /* 2 minutes */) >= expireDate) return true;
                                else return false;
};
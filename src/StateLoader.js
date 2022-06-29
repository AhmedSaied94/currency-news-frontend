class StateLoader {

    loadState() {
        try {
            let serializedState = localStorage.getItem("http://serrafa.com:state");

            if (serializedState === null) {
                return this.initializeState();
            }

            return JSON.parse(serializedState);
        }
        catch (err) {
            return this.initializeState();
        }
    }

    saveState(state) {
        try {
            let serializedState = JSON.stringify(state);
            localStorage.setItem("http://serrafa.com:state", serializedState);

        }
        catch (err) {
        }
    }

    initializeState() {
        return {
            constants:{
                host:'http://38.242.255.43',
                login:false,
                signup:false,
                reset:false,
                changeCur:false,
                sympols:{},
                geoData:{}
            },
            user:{
                authedUser:null
            },
            allCurrencies:{
                metals:[],
                basesCurrencies:null,
                currency:null,
            }

        };
    }
}
export default StateLoader

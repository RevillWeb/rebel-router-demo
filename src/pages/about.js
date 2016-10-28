window.customElements.define("about-page", class extends RebelRoute {
    constructor() {
        super();
        console.log("YUS!");
    }
    load() {
        return new Promise((resolve) => {
            setTimeout(() => {
                super.load().then(function(){
                    resolve();
                });
            }, 5000);
        });
    }
});
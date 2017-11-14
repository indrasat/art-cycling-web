(function () {
    'use strict'; 
   
    angular
        .module('main')
        .controller('ContactCtrl', ContactCtrl);

    function ContactCtrl($stateParams, ContactService, Notification, $log, MEDIA_URL, $state) {
        var vm = this;
        /*** Send Email  */
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            secure: false,
            port: 25,
            auth: {
            user: 'gaung717@gmail.com',
            pass: '80080pitu-o'
            },
            tls: {
            rejectUnauthorized: false
            }
        });
        
        let HelperOptions = {
            from: '"Indra" <gaung717@gmail.com>',
            to: 'indra@neo-fusion.com',
            subject: 'tes',
            text: 'tes kirim dengan nodemail'
        };
        
        /*** End of Send Email  */
  
        init();

        vm.toolbarEditor = [
            ['h1', 'h2', 'h3', 'h4', 'h5', 'p', 'bold', 'italics', 'underline', 'justifyLeft', 'justifyCenter', 'justifyRight', 'html']
        ];

        vm.save = save;

        function init() {
            getPages();

            /*** Send Email  */
            transporter.sendMail(HelperOptions, (error, info) => {
                if (error) {
                  return console.log(error);
                }
                console.log("The message was sent!");
                console.log(info);
              });
        }
        
        function getPages() {
            function success(response) {
                vm.pages = response.data.objects;
            }

            function error(response) {
                $log.error(response.data);
            }

            ContactService
                .getPages()
                .then(success, error);
        } 

        function save(index) {
            function success() {
                Notification.primary('Update Page "' + vm.pages[index].title + '" success!');
            }

            function error(response) {
                $log.error(response.data);
            }

            ContactService
                .updatePages(vm.pages[index])
                .then(success, error);
        }

        function onMapLoaded() {
            vm.ngMap.getMap().then(function (map) {
                self.gMap = map;
                google.maps.event.trigger(vm.gMap, 'resize');
            });
        }
    }
})();

app.controller('scratcheCtrl', function() {
  var vm = this;

  vm.scratch = '';

  vm.log = function()  {
    console.log(vm.scratch);
  };
});

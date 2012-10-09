Vagrant::Config.run do |config|
  # updated to use more recent version of Ubuntu
  config.vm.box = "precise64"

  config.vm.forward_port 3000, 3000
  config.vm.forward_port 43000,43000,{ :protocol => "udp"}

  config.vm.share_folder "app", "/home/vagrant/app", "app"

  # allow for symlinks in the app folder
  config.vm.customize ["setextradata", :id, "VBoxInternal2/SharedFoldersEnableSymlinksCreate/app", "1"]


  config.vm.provision :chef_solo do |chef|
    chef.add_recipe "nodejs"
    # Uncomment the line below if you're using a version of node
    # that doesn't include NPM, (version less than 0.6.3)
    # chef.add_recipe "nodejs::npm"
    # chef.add_recipe "mongodb-debs"
    chef.add_recipe "redis-server"
    chef.json = {
      "nodejs" => {
        "version" => "0.8.11"
      }    	      
    }
  end
  # Do a few things after setup
  # sh script does not execute properly when host is windows machine as it borks up line endings, 
  # more info at: https://groups.google.com/forum/#!msg/vagrant-up/5oafKuFUWrg/PbYIVuZevAIJ
  # config.vm.provision :shell, :path => "postsetup.sh"
end

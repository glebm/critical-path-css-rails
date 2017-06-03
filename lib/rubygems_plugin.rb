Gem.pre_install do
  require_relative './npm_commands'
  NpmCommands.new.install
end

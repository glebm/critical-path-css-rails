source 'https://rubygems.org'

gemspec

gem 'rubocop', require: false

# Gem hooks are not triggered for the gemspec gem
# https://github.com/bundler/bundler/issues/2354
# Work around this by requiring the hooks here
require_relative './lib/rubygems_plugin'

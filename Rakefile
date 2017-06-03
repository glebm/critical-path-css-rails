desc 'Update the vendored version of penthouse'
task :update_penthouse do # rubocop:disable Metrics/BlockLength
  require 'net/http'
  require 'uri'
  fetch = lambda do |url|
    uri = URI.parse(url)
    response = Net::HTTP.start(uri.host, uri.port, use_ssl: true) do |http|
      http.request(Net::HTTP::Get.new(uri.path, 'User-Agent' => 'Ruby'))
    end
    case response
      when Net::HTTPSuccess
        response.body
      when Net::HTTPRedirection
        # unpkg.com returns a relative URL in the `location` field.
        location = uri.clone
        location.path = URI.parse(response['location']).path
        location
      else
        response.error!
    end
  end
  local_root = 'lib/penthouse'
  remote_root = "#{fetch['https://unpkg.com/penthouse']}/lib"

  File.write File.join(local_root, 'timeago.js'),
             fetch["#{remote_root}/dist/timeago.js"]
  File.write File.join(local_root, 'timeago.locales.js'),
             fetch["#{remote_root}/dist/timeago.locales.min.js"]
  src = fetch.call.body
  # Remove the source mapping comment as this gem does not bundle source maps:
  src.sub!(%r{^//# sourceMappingURL=.*\n\z}, '')
  File.write(File.join('lib/penthouse/penthouse.js'), src)

  version_path = File.join('lib/popper_js/version.rb')
  File.write version_path,
             File.read(version_path)
                 .sub(/VERSION = '.*?'/,
                      "VERSION = '#{uri.path.split('@')[-1]}'")

  STDERR.puts "Updated from #{uri}"
end

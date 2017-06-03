require 'open3'

module CriticalPathCss
  class CssFetcher
    require 'critical_path_css/configuration'

    JS_FETCHER_PATH = File.expand_path('../fetch-css.js',
                                       File.dirname(__FILE__)).freeze

    def initialize
      @config = Configuration.new
    end

    def fetch
      @config.routes.map { |route| [route, css_for_route(route)] }.to_h
    end

    def fetch_route(route)
      css_for_route route
    end

    protected

    def css_for_route(route)
      options = {
        url: @config.base_url + route,
        cssPath: @config.css_path,
        phantomJsOptions: {
          :'ignore-ssl-errors' => true,
          :'ssl-protocol' => 'tlsv1'
        }
      }
      out, err, st = Open3.capture3('node', JS_FETCHER_PATH, JSON.dump(options))
      unless st.exitstatus.zero?
        STDOUT.puts out
        STDERR.puts err
        raise "Failed to get CSS for route #{route}\n" \
              "  with options=#{options.inspect}"
      end
      out
    end
  end
end

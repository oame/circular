require "bundler/setup"
require "dotenv"
Dotenv.load

require "twitter"

client = Twitter::REST::Client.new do |config|
  config.consumer_key        = ENV["CONSUMER_KEY"]
  config.consumer_secret     = ENV["CONSUMER_SECRET"]
  config.access_token        = ENV["ACCESS_TOKEN"]
  config.access_token_secret = ENV["ACCESS_TOKEN_SECRET"]
end

puts "Fetching ..."

friends = []
client.friend_ids.to_h[:ids].each_slice(100) do |ids|
  friends.concat client.users(ids).map{|f| f.to_h[:name]}
end

puts "-" * 30

friends.each do |name|
  if name =~ /(?:([1-3一二三])日目.*)?([A-Zぁ-んァ-ン]\-?\d{2}[ab])/
    puts name
  end
end
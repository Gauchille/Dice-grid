class Lobby < ApplicationRecord
  belongs_to :game
  has_many :participants
end

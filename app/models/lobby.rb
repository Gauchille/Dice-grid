class Lobby < ApplicationRecord
  belongs_to :game
  has_many :participants
  has_many :users, through: :participants
end

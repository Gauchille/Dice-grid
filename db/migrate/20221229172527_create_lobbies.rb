class CreateLobbies < ActiveRecord::Migration[7.0]
  def change
    create_table :lobbies do |t|
      t.integer :nb_player
      t.references :game, null: false, foreign_key: true

      t.timestamps
    end
  end
end

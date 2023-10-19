<?php
/**
 * by denisbespyatov/directchat
 */
use denisbespyatov\directchat\migrations\Migration;

/**
 * Class m151121_105453_message_table
 *
 * @author Denis Bespyatov <denis@bespyatov.ru>
 * @since 1.0
 */
class m151121_105453_message_table extends Migration
{
    public function up()
    {
        $this->createTable(self::TABLE_MESSAGE, [
            'id' => $this->bigPrimaryKey()->unsigned(),
            'sender_id' => $this->integer()->unsigned()->notNull(),
            'receiver_id' => $this->integer()->unsigned()->notNull(),
            'text' => $this->string(1020)->notNull(),
            'is_new' => $this->boolean()->defaultValue(true),
            'is_deleted_by_sender' => $this->boolean()->defaultValue(false),
            'is_deleted_by_receiver' => $this->boolean()->defaultValue(false),
            'created_at' => $this->dateTime()->notNull(),
        ], $this->tableOptions);
        $tableName = $this->db->getSchema()->getRawTableName(self::TABLE_MESSAGE);
        $this->addForeignKey(
            "fk-$tableName-sender_id",
            self::TABLE_MESSAGE,
            'sender_id',
            self::TABLE_USER,
            'id',
            'NO ACTION',
            'CASCADE'
        );
        $this->addForeignKey(
            "fk-$tableName-receiver_id",
            self::TABLE_MESSAGE,
            'receiver_id',
            self::TABLE_USER,
            'id',
            'NO ACTION',
            'CASCADE'
        );
    }

    public function down()
    {
        $this->dropTable(self::TABLE_MESSAGE);
    }
}

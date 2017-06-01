/**
 * @file filterLink command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const sql = require('sqlite');
sql.open('./data/Bastion.sqlite');

exports.run = (Bastion, message) => {
  if (!message.member.hasPermission(this.help.userPermission)) return Bastion.log.info('User doesn\'t have permission to use this command.');
  if (!message.guild.me.hasPermission(this.help.botPermission)) {
    return message.channel.send({
      embed: {
        color: Bastion.colors.red,
        description: `I need **${this.help.botPermission}** permission to use this command.`
      }
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }

  sql.get(`SELECT filterLink FROM guildSettings WHERE guildID=${message.guild.id}`).then(row => {
    let color, filterLinkStats;
    if (row.filterLink === 'false') {
      sql.run(`UPDATE guildSettings SET filterLink='true' WHERE guildID=${message.guild.id}`).catch(e => {
        Bastion.log.error(e.stack);
      });
      color = Bastion.colors.green;
      filterLinkStats = 'Enabled automatic deletion of links posted in this server.';
    }
    else {
      sql.run(`UPDATE guildSettings SET filterLink='false' WHERE guildID=${message.guild.id}`).catch(e => {
        Bastion.log.error(e.stack);
      });
      color = Bastion.colors.red;
      filterLinkStats = 'Disabled automatic deletion of links posted in this server.';
    }

    message.channel.send({
      embed: {
        color: color,
        description: filterLinkStats
      }
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'filterlink',
  description: 'Toggles automatic deleting of any links posted in the server. Does not apply to the server Administrators.',
  botPermission: 'MANAGE_MESSAGES',
  userPermission: 'ADMINISTRATOR',
  usage: 'filterLink',
  example: []
};

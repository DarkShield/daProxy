var xss = {[
{match: "(?i)(<script[^>]*>[\s\S]*?<\/script[^>]*>|<script[^>]*>[\s\S]*?<\/script[[\s\S]]*[\s\S]|<script[^>]*>[\s\S]*?<\/script[\s]*[\s]|<script[^>]*>[\s\S]*?<\/script|<script[^>]*>[\s\S]*?)"},
{match: "(?i)([\s\"'`;\/0-9\=]+on\w+\s*=)"},
{match: "(?i)((?:=|U\s*R\s*L\s*\()\s*[^>]*\s*S\s*C\s*R\s*I\s*P\s*T\s*:|&colon;|[\s\S]allowscriptaccess[\s\S]|[\s\S]src[\s\S]|[\s\S]data:text\/html[\s\S]|[\s\S]xlink:href[\s\S]|[\s\S]base64[\s\S]|[\s\S]xmlns[\s\S]|[\s\S]xhtml[\s\S]|[\s\S]style[\s\S]|<style[^>]*>[\s\S]*?|[\s\S]@import[\s\S]|<applet[^>]*>[\s\S]*?|<meta[^>]*>[\s\S]*?|<object[^>]*>[\s\S]*?)"}
]};
import "./TinyEditor.scss";

import { useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Loader } from "rsuite";

const key = import.meta.env.VITE_TINY_KEY;

export default function TinyEditor({ initValue = "", onSave, loading = false }) {
   const editorRef = useRef(null);

   const [loadEditor, setLoadEditor] = useState(true);

   const saveContent = (editor) => {
      const content = editor.getContent();
      onSave && onSave(content);
   };

   return (
      <div className="tiny-editor">
         {loadEditor ? <Loader /> : null}
         <Editor
            apiKey={key}
            onInit={(_evt, editor) => {
               editorRef.current = editor;
               setLoadEditor(false);
            }}
            initialValue={initValue}
            init={{
               details_initial_state: "collapsed",
               fullscreen_native: true,
               statusbar: false,
               height: "100%",
               plugins: [
                  "accordion",
                  "advlist",
                  "autolink",
                  "lists",
                  "link",
                  "image",
                  "charmap",
                  "preview",
                  "anchor",
                  "searchreplace",
                  "visualblocks",
                  "code",
                  "fullscreen",
                  "insertdatetime",
                  "media",
                  "table",
                  "code",
                  "help",
                  "wordcount",
                  "save",
                  "emoticons",
                  "visualchars",
                  "autosave",
                  "nonbreaking",
                  "pagebreak",
               ],
               menu: {
                  file: {
                     title: "File",
                     items: "newdocument restoredraft | preview | importword exportpdf exportword | print | deleteallconversations",
                  },
                  edit: {
                     title: "Edit",
                     items: "undo redo | cut copy paste pastetext | selectall | searchreplace",
                  },
                  view: {
                     title: "View",
                     items: "code revisionhistory | visualaid visualchars visualblocks | spellchecker | preview fullscreen | showcomments",
                  },
                  insert: {
                     title: "Insert",
                     items: "image link media addcomment pageembed codesample inserttable | math | charmap emoticons hr | pagebreak nonbreaking anchor tableofcontents | insertdatetime",
                  },
                  format: {
                     title: "Format",
                     items: "bold italic underline strikethrough superscript subscript codeformat | styles blocks fontfamily fontsize align lineheight | forecolor backcolor | language | removeformat",
                  },
                  tools: {
                     title: "Tools",
                     items: "spellchecker spellcheckerlanguage | a11ycheck code wordcount",
                  },
                  table: {
                     title: "Table",
                     items: "inserttable | cell row column | advtablesort | tableprops deletetable",
                  },
                  help: { title: "Help", items: "help" },
               },
               toolbar:
                  "code | fontsize blocks | " +
                  "bold italic underline forecolor |" +
                  "alignleft aligncenter alignright alignjustify |" +
                  "blockquote emoticons link |" +
                  "bullist numlist | " +
                  "removeformat help|",
               // toolbar: "accordion addcomment aidialog aishortcuts aligncenter alignjustify alignleft alignnone alignright | anchor | blockquote blocks | backcolor | bold | casechange checklist copy cut | fontfamily fontsize forecolor h1 h2 h3 h4 h5 h6 hr indent | italic | language | lineheight | newdocument | outdent | paste pastetext | print exportpdf exportword importword | redo | remove removeformat | selectall | strikethrough | styles | subscript superscript underline | undo | visualaid | a11ycheck advtablerownumbering revisionhistory typopgraphy anchor restoredraft casechange charmap checklist code codesample addcomment showcomments ltr rtl editimage fliph flipv imageoptions rotateleft rotateright emoticons export footnotes footnotesupdate formatpainter fullscreen help image insertdatetime link openlink unlink bullist numlist media mergetags mergetags_list nonbreaking pagebreak pageembed permanentpen preview quickimage quicklink quicktable cancel save searchreplace showcomments spellcheckdialog spellchecker | table tablecellprops tablecopyrow tablecutrow tabledelete tabledeletecol tabledeleterow tableinsertdialog tableinsertcolafter tableinsertcolbefore tableinsertrowafter tableinsertrowbefore tablemergecells tablepasterowafter tablepasterowbefore tableprops tablerowprops tablesplitcells tableclass tablecellclass tablecellvalign tablecellborderwidth tablecellborderstyle tablecaption tablecellbackgroundcolor tablecellbordercolor tablerowheader tablecolheader | tableofcontents tableofcontentsupdate | template typography | insertfile inserttemplate addtemplate | visualblocks visualchars | wordcount",
               content_style: "body { font-family: Helvetica,sans-serif; font-size: 14px }",
               language: "vi",
               save_onsavecallback: saveContent,
               save_enablewhendirty: false,
            }}
         />
         {loading && (
            <div className="overlay">
               <div className="spinner"></div>
            </div>
         )}
      </div>
   );
}

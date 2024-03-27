#!/bin/bash

function combine_pdf() {
  gs -dNOPAUSE -dPDFSETTINGS=/screen -sDEVICE=pdfwrite -sOUTPUTFILE=$2 -dBATCH $1
}

function asciidoc_to_pdf() {
  asciidoctor-pdf $1 --out-file=$2
}

function generate_pdf() {
	local out_file=$1 && shift
	local asciidoc_source_dirs=($@)
  local tmp_dir="./output/$(uuidgen)"

  for asciidoc_source_dir in "${asciidoc_source_dirs[@]}"
  do
    find "$asciidoc_source_dir" -name "*.adoc" -type f | while read file; do asciidoc_to_pdf "$file" "${tmp_dir}/$(uuidgen).pdf"; done
  done

  combine_pdf "${tmp_dir}/*.pdf" "$out_file"

  rm -rf "$tmp_dir"
}

full_documentation_dirs=(
  "./docs/ua/modules/admin/pages"
  "./docs/ua/modules/arch/pages/architecture"
  "./docs/ua/modules/registry-develop/pages"
  "./docs/ua/modules/ROOT/pages"
  "./docs/ua/modules/testing/pages"
  "./docs/ua/modules/user/pages"
)

arch_docs_dirs=(
  "./docs/ua/modules/arch/pages/architecture"
  "./docs/ua/modules/testing/pages"
  "./docs/ua/modules/ROOT/pages"
)

all_guides_dirs=(
  "./docs/ua/modules/admin/pages"
  "./docs/ua/modules/registry-develop/pages"
  "./docs/ua/modules/ROOT/pages"
  "./docs/ua/modules/user/pages"
)

admin_guides_dirs=(
  "./docs/ua/modules/admin/pages"
  "./docs/ua/modules/ROOT/pages"
)

develop_guides_dirs=(
  "./docs/ua/modules/registry-develop/pages"
  "./docs/ua/modules/ROOT/pages"
)

#generate_pdf "./build/pdf/ddm-documentation-ua.pdf" "${full_documentation_dirs[@]}"
#generate_pdf "./build/pdf/ddm-arch-ua.pdf" "${arch_docs_dirs[@]}"
#generate_pdf "./build/pdf/ddm-all-guides-ua.pdf" "${all_guides_dirs[@]}"
#generate_pdf "./build/pdf/ddm-develop-guides-ua.pdf" "${develop_guides_dirs[@]}"
#generate_pdf "./build/pdf/ddm-admin-guides-ua.pdf" "${admin_guides_dirs[@]}"